import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Xác thực JWT của user gọi function
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Thiếu Authorization header');
    }
    
    // Tạo client theo user token để lấy uid
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error('Không thể xác thực người dùng');

    // Kiem tra xem ho co phai Admin khong (Bỏ qua buoc nay neu muon de test)
    const { data: adminProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profileError || adminProfile?.role !== 'admin') {
       throw new Error('Bạn không có quyền thực hiện hành động này');
    }

    // Lay payload tu request
    const { action, targetUserId, payload } = await req.json();
    if (!action || !targetUserId || !payload) {
      throw new Error('Thiếu thông số action, targetUserId hoặc payload');
    }

    let updateData = {};
    if (action === 'delete') {
      updateData = { status: 'suspended' };
    } else if (action === 'role') {
      updateData = { role: payload };
    } else if (action === 'edit') {
      updateData = { full_name: payload };
    } else {
      throw new Error('Hành động không hợp lệ');
    }

    // Update nguoi dung
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', targetUserId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
