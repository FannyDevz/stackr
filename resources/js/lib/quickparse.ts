import { addDays, format, nextDay, type Day } from 'date-fns'
import type { Tag } from './types'

export interface ParsedQuickAdd {
  title: string
  due_date?: string
  tag_ids?: number[]
  priority?: 'high' | 'medium' | 'low'
}

const WEEKDAYS: Record<string, Day> = {
  sunday: 0, sun: 0, minggu: 0, ahad: 0,
  monday: 1, mon: 1, senin: 1,
  tuesday: 2, tue: 2, selasa: 2,
  wednesday: 3, wed: 3, rabu: 3,
  thursday: 4, thu: 4, kamis: 4,
  friday: 5, fri: 5, jumat: 5, "jum'at": 5,
  saturday: 6, sat: 6, sabtu: 6,
}

/**
 * Parse a quick-add string into task fields.
 *  - `#tag`  → matches an existing tag (by name, case-insensitive)
 *  - `!high|!med|!low` (or `!h/!m/!l`) → priority
 *  - dates: today/hari ini, tomorrow/besok, lusa, weekday names (EN/ID),
 *    "next monday" / "senin depan", "in N days" / "N hari lagi"
 *  - times (5pm, 17:00) are stripped (only dates are stored)
 */
export function parseQuickAdd(input: string, tags: Tag[] = []): ParsedQuickAdd {
  let text = ` ${input} `
  const out: ParsedQuickAdd = { title: '' }

  // priority
  text = text.replace(/\s!(high|hi|h|medium|med|m|low|lo|l)\b/i, (_m, v: string) => {
    const c = v.toLowerCase()[0]
    out.priority = c === 'h' ? 'high' : c === 'm' ? 'medium' : 'low'
    return ' '
  })

  // tags (only recognised ones are consumed)
  const tagIds: number[] = []
  text = text.replace(/\s#([\p{L}\d_-]+)/gu, (m, name: string) => {
    const f = tags.find((t) => t.name.toLowerCase() === name.toLowerCase())
    if (f) {
      if (!tagIds.includes(f.id)) tagIds.push(f.id)
      return ' '
    }
    return m
  })
  if (tagIds.length) out.tag_ids = tagIds

  // strip time tokens (dates only are stored)
  text = text.replace(/\s\d{1,2}([:.]\d{2})?\s?(am|pm)\b/gi, ' ').replace(/\s([01]?\d|2[0-3]):\d{2}\b/g, ' ')

  const today = new Date()
  let due: Date | null = null

  let m = text.match(/\sin (\d+) days?\b/i) ?? text.match(/\s(\d+) hari(?: lagi)?\b/i)
  if (m) {
    due = addDays(today, parseInt(m[1], 10))
    text = text.replace(m[0], ' ')
  }

  if (!due) {
    const words: [RegExp, () => Date][] = [
      [/\s(today|hari ini)\b/i, () => today],
      [/\s(tomorrow|besok|bsk|esok)\b/i, () => addDays(today, 1)],
      [/\s(lusa|day after tomorrow)\b/i, () => addDays(today, 2)],
    ]
    for (const [re, fn] of words) {
      const mm = text.match(re)
      if (mm) {
        due = fn()
        text = text.replace(mm[0], ' ')
        break
      }
    }
  }

  if (!due) {
    const keys = Object.keys(WEEKDAYS).sort((a, b) => b.length - a.length)
    const group = keys.map((k) => k.replace("'", "\\'")).join('|')
    // Indonesian: "senin depan"
    const idNext = text.match(new RegExp(`\\s(${group})\\s+depan\\b`, 'i'))
    // English/short: "[next] monday"
    const en = text.match(new RegExp(`\\s(next\\s+)?(${group})\\b`, 'i'))
    if (idNext) {
      due = addDays(nextDay(today, WEEKDAYS[idNext[1].toLowerCase()]), 7)
      text = text.replace(idNext[0], ' ')
    } else if (en) {
      let d = nextDay(today, WEEKDAYS[en[2].toLowerCase()])
      if (en[1]) d = addDays(d, 7)
      due = d
      text = text.replace(en[0], ' ')
    }
  }

  if (due) out.due_date = format(due, 'yyyy-MM-dd')
  out.title = text.replace(/\s+/g, ' ').trim()
  return out
}
