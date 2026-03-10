// =============================================
// API DE REGISTRO DE USUÁRIO
// =============================================

import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Verifica se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    // Cria o hash da senha
    const hashedPassword = await hashPassword(password)

    // Cria o usuário
    const user = await db.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      }
    })

    // Retorna sucesso (sem a senha)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    })

  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
