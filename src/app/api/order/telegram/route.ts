import { NextResponse } from "next/server";

const PAYMENT_LABELS: Record<string, string> = {
  prepay: "Предоплата на банковские реквизиты",
  cod: "Наложенный платёж",
  crypto: "Криптовалюта USDT TRC-20 (Хелекет)",
};

const DELIVERY_LABELS: Record<string, string> = {
  post: "Почта до отделения",
  courier: "Курьер до двери",
};

const CONTACT_LABELS: Record<string, string> = {
  telegram: "Телеграм",
  instagram: "Инстаграм",
  whatsapp: "WhatsApp",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clampStr(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  memoryGb?: number;
};

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Telegram не настроен на сервере" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Пустое тело запроса" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;

  const name = clampStr(o.name, 200);
  const phone = clampStr(o.phone, 50);
  const comment = clampStr(o.comment ?? "", 2000);
  const city = clampStr(o.city, 200);
  const address = clampStr(o.address, 500);

  const payment = o.payment;
  const delivery = o.delivery;
  const contactMethod = o.contactMethod;

  if (!name || !phone) {
    return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
  }

  if (
    payment !== "prepay" &&
    payment !== "cod" &&
    payment !== "crypto"
  ) {
    return NextResponse.json({ error: "Некорректный способ оплаты" }, { status: 400 });
  }

  if (delivery !== "post" && delivery !== "courier") {
    return NextResponse.json({ error: "Некорректная доставка" }, { status: 400 });
  }

  if (payment === "cod" && delivery === "courier") {
    return NextResponse.json(
      { error: "Курьер недоступен при наложенном платеже" },
      { status: 400 }
    );
  }

  if (
    contactMethod !== "telegram" &&
    contactMethod !== "instagram" &&
    contactMethod !== "whatsapp"
  ) {
    return NextResponse.json({ error: "Некорректный способ связи" }, { status: 400 });
  }

  if (!city || !address) {
    return NextResponse.json({ error: "Город и адрес обязательны" }, { status: 400 });
  }

  const itemsRaw = o.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }
  if (itemsRaw.length > 100) {
    return NextResponse.json({ error: "Слишком много позиций" }, { status: 400 });
  }

  const items: OrderItem[] = [];
  for (const row of itemsRaw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const itemName = clampStr(r.name, 500);
    const qty = Number(r.quantity);
    const price = Number(r.price);
    if (!itemName || !Number.isFinite(qty) || qty < 1 || qty > 999) continue;
    if (!Number.isFinite(price) || price < 0 || price > 1e9) continue;
    items.push({
      id: clampStr(r.id, 120),
      name: itemName,
      quantity: Math.floor(qty),
      price,
      color: r.color != null ? clampStr(r.color, 100) : undefined,
      memoryGb:
        r.memoryGb != null && Number.isFinite(Number(r.memoryGb))
          ? Math.floor(Number(r.memoryGb))
          : undefined,
    });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Нет корректных позиций" }, { status: 400 });
  }

  const cartTotal = Number(o.cartTotal);
  const payableAmount = Number(o.payableAmount);
  if (!Number.isFinite(cartTotal) || cartTotal < 0) {
    return NextResponse.json({ error: "Некорректная сумма корзины" }, { status: 400 });
  }
  if (!Number.isFinite(payableAmount) || payableAmount < 0) {
    return NextResponse.json({ error: "Некорректная сумма к оплате" }, { status: 400 });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

  const lines: string[] = [
    "<b>Новый заказ Loom Store</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Связь:</b> ${escapeHtml(CONTACT_LABELS[contactMethod])}`,
    `<b>Оплата:</b> ${escapeHtml(PAYMENT_LABELS[payment])}`,
    `<b>Доставка:</b> ${escapeHtml(DELIVERY_LABELS[delivery])}`,
    `<b>Город:</b> ${escapeHtml(city)}`,
    `<b>Адрес:</b> ${escapeHtml(address)}`,
    "",
    "<b>Товары:</b>",
  ];

  for (const it of items) {
    const bits = [
      escapeHtml(it.name),
      `×${it.quantity}`,
      fmt(it.price * it.quantity),
    ];
    if (it.color) bits.push(`(${escapeHtml(it.color)})`);
    if (it.memoryGb != null) bits.push(`${it.memoryGb} ГБ`);
    lines.push(`• ${bits.join(" ")}`);
  }

  lines.push("");
  lines.push(`<b>Сумма корзины:</b> ${escapeHtml(fmt(cartTotal))}`);
  lines.push(`<b>К оплате (выбранный способ):</b> ${escapeHtml(fmt(payableAmount))}`);

  if (comment) {
    lines.push("");
    lines.push(`<b>Комментарий:</b> ${escapeHtml(comment)}`);
  }

  const text = lines.join("\n");

  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const tgRes = await fetch(tgUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const tgJson = (await tgRes.json().catch(() => null)) as {
    ok?: boolean;
    description?: string;
  } | null;

  if (!tgRes.ok || !tgJson?.ok) {
    console.error("Telegram sendMessage failed:", tgRes.status, tgJson);
    return NextResponse.json(
      { error: "Не удалось отправить заказ в Telegram" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
