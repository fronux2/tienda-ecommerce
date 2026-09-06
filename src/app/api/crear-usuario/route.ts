// app/api/crear-usuario/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

/**
 * Crea un usuario ya confirmado. Usa la service role key, que bypasea RLS por
 * completo, asi que la autorizacion tiene que verificarse aca: proteger solo la
 * pagina del panel no sirve de nada, cualquiera puede llamar al endpoint.
 *
 * Queda con email_confirm: true a proposito: es un admin dando de alta a alguien,
 * no un registro publico (ese pasa por /registro y si exige verificar el correo).
 */
export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('id', user.id)
    .single();

  if (!perfil || perfil.rol_id === null || perfil.rol_id < 2) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await req.json();
  const { email, password } = body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user }, { status: 200 });
}
