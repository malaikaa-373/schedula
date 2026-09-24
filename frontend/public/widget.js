// document.currentScript apne aap us <script> tag ko refer karta hai jo abhi chal raha hai
const scriptTag = document.currentScript
const calendarId = scriptTag.getAttribute("data-calendar-id")

const iframe = document.createElement("iframe")

iframe.src = `https://schedula-frontend-ruby.vercel.app/embed/${businessId}/${calendarId}`;
iframe.style.width = "100%"
iframe.style.height = "600px"
iframe.style.border = "none"

scriptTag.parentNode.insertBefore(iframe, scriptTag.nextSibling)