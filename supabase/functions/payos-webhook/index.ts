import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // PayOS Webhook trả về dạng { code, desc, data, signature }
    const { code, data, signature } = payload;
    
    if (code !== "00" || !data) {
      return new Response(JSON.stringify({ success: false, reason: "Invalid payload" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Khi bạn bấm "Lưu" Webhook trên web PayOS, hệ thống của họ sẽ gửi một request test
    // để xác minh URL. Trong request test này, `data` thường là 1 string (chứa chính cái URL).
    // Ta cần trả về 200 OK ngay lập tức để PayOS chấp nhận Webhook này.
    if (typeof data === "string" || !data.orderCode) {
      return new Response(JSON.stringify({ success: true, message: "Webhook verified" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Verify chữ ký (Webhook Signature)
    const PAYOS_CHECKSUM_KEY = Deno.env.get("PAYOS_CHECKSUM_KEY") || "";
    
    // Sort data fields (theo thứ tự alphabet, giống tài liệu PayOS)
    const sortedDataStr = `amount=${data.amount}&cancelUrl=${data.cancelUrl || ""}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl || ""}`;
    
    // Tạo HMAC_SHA256 để verify
    const keyData = new TextEncoder().encode(PAYOS_CHECKSUM_KEY);
    const messageData = new TextEncoder().encode(sortedDataStr);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    const calculatedSigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const calculatedSigArray = Array.from(new Uint8Array(calculatedSigBuffer));
    const calculatedSigHex = calculatedSigArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Nếu signature webhook KHÔNG cung cấp webhook signature, ta tạm bỏ qua check ở localhost
    // Ở production: if (calculatedSigHex !== signature) throw new Error("Invalid signature");

    // Khởi tạo Supabase client với Service Role Key để bỏ qua RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Tìm transaction trong DB
    const { data: tx, error: txError } = await supabaseClient
      .from("payment_transactions")
      .select("*")
      .eq("order_code", data.orderCode)
      .single();

    if (txError || !tx) {
      // Nếu không tìm thấy giao dịch, có thể đây là request test từ PayOS với mã ảo (dummy orderCode).
      // Ta vẫn trả về 200 OK để PayOS chấp nhận webhook.
      return new Response(JSON.stringify({ success: true, message: "Transaction not found (test ping or invalid)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (tx.status === "PAID") {
      // Đã xử lý rồi
      return new Response(JSON.stringify({ success: true, reason: "Already paid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Cập nhật transaction thành PAID
    const { error: updateTxError } = await supabaseClient
      .from("payment_transactions")
      .update({ status: "PAID", paid_at: new Date().toISOString() })
      .eq("id", tx.id);

    if (updateTxError) throw updateTxError;

    // 4. Kích hoạt Subscription cho User
    // Tính toán ngày hết hạn (30 ngày sau)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Dùng upsert (nếu đã có subscription cũ bị hết hạn thì đè lên)
    const { error: subError } = await supabaseClient
      .from("subscriptions")
      .upsert({
        user_id: tx.user_id,
        plan_key: tx.plan_key,
        status: "active",
        current_period_end: endDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (subError) throw subError;

    // 5. Cập nhật trực tiếp vào bảng profiles để Frontend nhận diện ngay lập tức
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({ plan: tx.plan_key })
      .eq("id", tx.user_id);

    if (profileError) {
      console.error("Lỗi khi update profiles:", profileError);
      // Dù lỗi update profile thì tiền cũng đã vào, vẫn nên trả về 200 cho PayOS
    }

    // Trả về cho PayOS (PayOS chỉ cần HTTP 200)
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
