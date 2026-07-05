import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import PayOS
// Note: We use the REST API approach for Deno Edge Functions
// because the @payos/node package relies on Node.js standard modules.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { planKey, returnUrl } = await req.json();

    // 1. Lấy thông tin user từ JWT (đảm bảo bảo mật)
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader || "" } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Định nghĩa giá theo plan
    let price = 0;
    if (planKey === "plus") {
      price = 19000;
    } else if (planKey === "pro") {
      price = 29000;
    } else {
      throw new Error("Invalid plan key");
    }

    // 3. Tạo orderCode duy nhất (Kiểu Number - bắt buộc cho PayOS)
    // Lấy thời gian hiện tại làm prefix, cộng với random 3 số
    const orderCode = Number(String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 900) + 100));

    // 4. Lưu transaction vào database với trạng thái PENDING
    const { error: dbError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        user_id: user.id,
        plan_key: planKey,
        order_code: orderCode,
        amount: price,
        provider: "payos",
        status: "PENDING",
      });

    if (dbError) throw dbError;

    // 5. Gọi PayOS API để tạo link thanh toán
    const PAYOS_CLIENT_ID = Deno.env.get("PAYOS_CLIENT_ID");
    const PAYOS_API_KEY = Deno.env.get("PAYOS_API_KEY");
    const PAYOS_CHECKSUM_KEY = Deno.env.get("PAYOS_CHECKSUM_KEY");
    const FRONTEND_URL = returnUrl || Deno.env.get("FRONTEND_URL") || "http://localhost:5173";
    // Khởi tạo signature
    // Document PayOS: HmacSHA256 của chuỗi "amount=...&cancelUrl=...&description=...&orderCode=...&returnUrl=..."
    // Trong Deno, ta có thể dùng Web Crypto API hoặc gọi qua API Gateway của PayOS bằng cách dùng API Key
    
    // Tạo body cho PayOS
    const body = {
      orderCode,
      amount: price,
      description: `WANDERLAB ${planKey.toUpperCase()}`.substring(0, 25), // max 25 chars
      items: [{ name: `WanderLab ${planKey} Plan`, quantity: 1, price }],
      returnUrl: `${FRONTEND_URL}/payment-success`,
      cancelUrl: `${FRONTEND_URL}/payment-cancel`,
    };

    // Theo doc của PayOS v2: signature = HMAC_SHA256(checksumKey, sort(data))
    // Tạo chuỗi signature
    const signatureData = `amount=${body.amount}&cancelUrl=${body.cancelUrl}&description=${body.description}&orderCode=${body.orderCode}&returnUrl=${body.returnUrl}`;
    
    const keyData = new TextEncoder().encode(PAYOS_CHECKSUM_KEY);
    const messageData = new TextEncoder().encode(signatureData);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const finalBody = {
      ...body,
      signature: signatureHex,
    };

    // Gửi request tới PayOS
    const payosRes = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": PAYOS_CLIENT_ID || "",
        "x-api-key": PAYOS_API_KEY || "",
      },
      body: JSON.stringify(finalBody),
    });

    const payosData = await payosRes.json();

    if (payosData.code !== "00") {
      throw new Error(`PayOS Error: ${payosData.desc}`);
    }

    // 6. Trả về checkoutUrl
    return new Response(JSON.stringify({ checkoutUrl: payosData.data.checkoutUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
