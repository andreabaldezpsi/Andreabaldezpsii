import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function dailyPost(path: string, body: unknown, apiKey: string) {
  const response = await fetch(`https://api.daily.co/v1${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Provedor de vídeo recusou a operação (${response.status}).`);
  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt || jwt === authHeader) return json({ error: "Autenticação necessária." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const dailyKey = Deno.env.get("DAILY_API_KEY");
    if (!supabaseUrl || !serviceKey || !dailyKey) {
      return json({ error: "Servidor ainda não configurado." }, 500);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await admin.auth.getUser(jwt);
    const user = userData?.user;
    if (userError || !user) return json({ error: "Sessão inválida ou expirada." }, 401);

    const { data: profile, error: profileError } = await admin
      .from("profiles").select("role").eq("id", user.id).single();
    if (profileError || profile?.role !== "psychologist") {
      return json({ error: "Somente a psicóloga autorizada pode criar salas." }, 403);
    }

    // Sala individual, privada, limitada a dois participantes e com expiração.
    const now = Math.floor(Date.now() / 1000);
    const expires = now + 60 * 60; // 1 hora; ajuste à duração contratada das sessões.
    const roomName = `ab-${crypto.randomUUID().replaceAll("-", "").slice(0, 20)}`;
    const room = await dailyPost("/rooms", {
      name: roomName,
      privacy: "private",
      properties: {
        exp: expires,
        eject_at_room_exp: true,
        max_participants: 2,
        enable_prejoin_ui: true,
        enable_knocking: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }, dailyKey);

    const ownerToken = await dailyPost("/meeting-tokens", {
      properties: {
        room_name: roomName,
        is_owner: true,
        user_name: "Psicóloga Andréa Baldez",
        exp: expires,
      },
    }, dailyKey);

    const patientToken = await dailyPost("/meeting-tokens", {
      properties: {
        room_name: roomName,
        user_name: "Paciente",
        exp: expires,
      },
    }, dailyKey);

    const { error: insertError } = await admin.from("sessions").insert({
      psychologist_id: user.id,
      provider_room_name: roomName,
      expires_at: new Date(expires * 1000).toISOString(),
    });
    if (insertError) throw new Error("Não foi possível registrar a sessão.");

    return json({
      room_url: room.url,
      psychologist_token: ownerToken.token,
      patient_token: patientToken.token,
      expires_at: new Date(expires * 1000).toISOString(),
    });
  } catch (error) {
    // Não retornar detalhes internos, tokens, credenciais ou conteúdo de chamadas.
    console.error("create-session failed:", error instanceof Error ? error.message : "unknown");
    return json({ error: "Falha ao criar a sala. Verifique as configurações e tente novamente." }, 500);
  }
});
