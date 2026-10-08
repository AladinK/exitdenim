import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { name?: string; orderNumber?: string; status?: string }

const COPY: Record<string, { title: string; subject: string; body: string }> = {
  confirmed: {
    title: 'Porudžbina je potvrđena',
    subject: 'potvrđena',
    body: 'Tvoja porudžbina je potvrđena i pakujemo je. Šaljemo je u roku od 1–2 radna dana.',
  },
  shipped: {
    title: 'Predato kurirskoj službi',
    subject: 'predata kuriru',
    body: 'Tvoja porudžbina je predata kurirskoj službi i stiže uskoro. Pripremi iznos za plaćanje pouzećem — plaćaš kuriru kad stigne.',
  },
  delivered: {
    title: 'Porudžbina je isporučena',
    subject: 'isporučena',
    body: 'Tvoja porudžbina je isporučena. Hvala što nosiš EXIT. Ako nešto nije kako treba, javi nam se.',
  },
  cancelled: {
    title: 'Porudžbina je otkazana',
    subject: 'otkazana',
    body: 'Tvoja porudžbina je otkazana. Ako misliš da je u pitanju greška, javi nam se.',
  },
}

const fallback = { title: 'Status porudžbine je promenjen', subject: 'ažurirana', body: 'Status tvoje porudžbine je promenjen.' }

const OrderStatus = ({ name, orderNumber, status = '' }: Props) => {
  const c = COPY[status] ?? fallback
  return (
    <Html lang="sr" dir="ltr">
      <Head />
      <Preview>{c.title} — #{String(orderNumber ?? '')}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>EXIT DENIM</Text>
          <Heading style={h1}>{c.title}</Heading>
          <Text style={text}>{name ? `Zdravo ${name},` : 'Zdravo,'}</Text>
          <Text style={text}>{c.body}</Text>
          <Text style={text}>Broj porudžbine: <b>#{orderNumber}</b></Text>
          <Hr style={hr} />
          <Text style={muted}>Pitanja? Pozovi Ahmeda: +381 65 3171 6716</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderStatus,
  subject: (d: Record<string, any>) => `Porudžbina #${d.orderNumber ?? ''} je ${(COPY[d.status] ?? fallback).subject} — EXIT Denim`,
  displayName: 'Promena statusa porudžbine',
  previewData: { name: 'Marko', orderNumber: 'EXR-261008-8781', status: 'shipped' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#0F1B33' }
const container = { padding: '32px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '0.3em', fontWeight: 700, color: '#1A2A48', margin: '0 0 24px' }
const h1 = { fontSize: '26px', margin: '0 0 12px', color: '#0F1B33' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333' }
const muted = { fontSize: '13px', color: '#777' }
const hr = { borderColor: '#E2DED5', margin: '20px 0' }
