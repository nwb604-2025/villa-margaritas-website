import { useState, useRef, type FormEvent } from 'react'
import { toast } from 'sonner'
import { validateContactForm } from '../lib/utils'
import type { ContactFormData } from '../../types'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return

    setLoading(true)

    const formData = new FormData(formRef.current)
    const object = Object.fromEntries(formData) as unknown as ContactFormData

    const { error } = validateContactForm(object)

    if (error) {
      toast.error(error)
      return setLoading(false)
    }

    const json = JSON.stringify(object)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      })

      const result = await response.json()

      if (response.status === 200) {
        toast.success('¡Mensaje enviado con éxito!', {
          description: 'Nos pondremos en contacto contigo pronto.',
        })
        formRef.current.reset()

        await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: object.nombre,
            correo: object.correo,
            telefono: object.telefono,
          }),
        })
      } else {
        toast.error('Ocurrió un error', {
          description: result.message || 'Por favor intenta nuevamente.',
        })
      }
    } catch (error) {
      toast.error('Error de conexión', {
        description: 'Verifica tu conexión a internet e inténtalo de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="intersect:animate-fade-up intersect:visible intersect-half rounded-lg border border-gray-100 bg-gray-50 p-8 shadow-md md:p-12"
    >
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <input
          type="hidden"
          name="access_key"
          value={import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY}
        />
        <input type="hidden" name="subject" value="Nuevo Mensaje - Villa Margaritas" />
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

        <div>
          <label
            htmlFor="name"
            className="text-dark mb-2 block font-sans text-sm font-bold tracking-wider uppercase"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="nombre"
            placeholder="Tu nombre completo"
            className="text-dark focus:border-primary focus:ring-primary w-full border border-gray-200 bg-white px-4 py-3 font-sans text-base transition-colors focus:ring-1 focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="text-dark mb-2 block font-sans text-sm font-bold tracking-wider uppercase"
          >
            Celular
          </label>
          <input
            type="tel"
            id="phone"
            name="telefono"
            placeholder="Tu número de teléfono"
            className="text-dark focus:border-primary focus:ring-primary w-full border border-gray-200 bg-white px-4 py-3 font-sans text-base transition-colors focus:ring-1 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="email"
          className="text-dark mb-2 block font-sans text-sm font-bold tracking-wider uppercase"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="correo"
          placeholder="tu@email.com"
          className="text-dark focus:border- primary focus:ring-primary transition-col ors w-full border border-gray-200 bg-white px-4 py-3 font-sans text-base focus:ring-1 focus:outline-none"
          required
        />
      </div>

      <div className="mb-8">
        <label
          htmlFor="message"
          className="text-dark mb-2 block font-sans text-sm font-bold tracking-wider uppercase"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="mensaje"
          rows={5}
          placeholder="¿En qué fechas te gustaría visitarnos?"
          className="text-dark focus:border-primary focus:ring-primary w-full resize-none border border-gray-200 bg-white px-4 py-3 font-sans text-base transition-colors focus:ring-1 focus:outline-none"
          required
        ></textarea>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-dark inline-flex cursor-pointer items-center justify-center gap-2 px-12 py-4 font-sans text-sm font-bold tracking-widest text-white uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Spinner />
              Enviando...
            </>
          ) : (
            'Enviar Mensaje'
          )}
        </button>
      </div>
    </form>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
