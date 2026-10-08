import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Item { product_name: string; size: string; quantity: number; unit_price: number }
interface Props {
  name?: string
  orderNumber?: string | number
  items?: Item[]
  subtotal?: number
  shipping?: number
  total?: number
  address?: string
}

const fmt = (n: number) => `${Number(n).toLocaleString('sr-RS')} din`

const OrderConfirmation = ({ name, orderNumber, items = [], subtotal = 0, shipping = 0, total = 0, address }: Props) => (
  <Html lang="sr" dir="ltr">
    <Head />
    <Preview>Porudžbina #{String(orderNumber ?? '')} je primljena — plaćaš kad stigne.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>EXIT DENIM</Text>
        <Heading style={h1}>Hvala{name ? `, ${name}` : ''}!</Heading>
        <Text style={text}>Primili smo tvoju porudžbinu <b>#{orderNumber}</b>. Spremamo je za pakovanje i šaljemo u roku od 1–2 radna dana. Plaćanje je pouzećem, kuriru pri preuzimanju.</Text>
        <Hr style={hr} />
        <Section>
          {items.map((i, idx) => (
            <Text key={idx} style={row}>{i.product_name} · vel. {i.size} × {i.quantity} — {fmt(i.unit_price * i.quantity)}</Text>
          ))}
        </Section>
        <Hr style={hr} />
        <Text style={row}>Međuzbir: {fmt(subtotal)}</Text>
        <Text style={row}>Dostava: {shipping === 0 ? 'Besplatna' : fmt(shipping)}</Text>
        <Text style={total_}>Ukupno: {fmt(total)}</Text>
        {address ? <Text style={muted}>Adresa dostave: {address}</Text> : null}
        <Hr style={hr} />
        <Text style={muted}>Pitanja? Pozovi Ahmeda: +381 65 3171 6716</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmation,
  subject: (d: Record<string, any>) => `Porudžbina #${d.orderNumber ?? ''} je primljena — EXIT Denim`,
  displayName: 'Potvrda porudžbine',
  previewData: {
    name: 'Marko', orderNumber: 1024,
    items: [{ product_name: 'EX-101 Slim Indigo', size: '32', quantity: 2, unit_price: 4950 }],
    subtotal: 9900, shipping: 0, total: 9900, address: 'Knez Mihailova 1, 11000 Beograd',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#0F1B33' }
const container = { padding: '32px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '0.3em', fontWeight: 700, color: '#1A2A48', margin: '0 0 24px' }
const h1 = { fontSize: '26px', margin: '0 0 12px', color: '#0F1B33' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333' }
const row = { fontSize: '14px', margin: '4px 0', color: '#333' }
const total_ = { fontSize: '17px', fontWeight: 700, margin: '8px 0', color: '#0F1B33' }
const muted = { fontSize: '13px', color: '#777' }
const hr = { borderColor: '#E2DED5', margin: '20px 0' }
