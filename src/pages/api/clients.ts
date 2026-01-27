import type { APIRoute } from 'astro'
import type { ClientData } from '../../../types'
import { sql } from '../../db'
import { isValidEmail, isValidPhone } from '../../lib/utils'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ClientData = await request.json()
    const { nombre, correo, telefono } = body

    if (!nombre || !correo || !telefono) {
      return new Response(
        JSON.stringify({
          error: 'Fields nombre, correo and telefono are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Name must be a valid text and cannot be empty',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof correo !== 'string' || !isValidEmail(correo)) {
      return new Response(
        JSON.stringify({
          error: 'correo must have a valid format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof telefono !== 'string' || !isValidPhone(telefono)) {
      return new Response(
        JSON.stringify({
          error: 'Phone must have a valid format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const cleanName = nombre.trim()
    const cleanEmail = correo.trim().toLowerCase()
    const cleanPhone = telefono.trim()

    await sql`
      INSERT INTO margaritas_clientes (nombre, correo, telefono)
      VALUES (${cleanName}, ${cleanEmail}, ${cleanPhone})
    `;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Client registered successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        type: 'server_error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
