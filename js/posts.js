/* =========================================================
   Trinetra Creations: Journal articles (Day 11)
   ONE file holds every article. Used by:
     - journal.html                     (a card for each article)
     - journal-post.html?post=<slug>    (the full article)
   This file only stores data: it doesn't change the page.

   !!! ALL 4 ARTICLES BELOW ARE SAMPLES !!!
   Written by us to show how the Journal will look.
   ========================================================= */

// Master switch: true = show a "Sample" badge on every article card and article.
const SHOW_SAMPLE_POSTS = true;

// One object per article. NEWEST FIRST: the order here is the order on the
// Journal page, and it decides "previous" and "next" on each article.
// Fields:
//   slug         short name used in the link (lowercase letters, numbers, dashes).
//                It becomes the address: journal-post.html?post=why-your-logo-is-not-your-brand
//                Changing it later breaks any link people have already shared.
//   title        the headline (also the browser tab title)
//   date         "YYYY-MM-DD" (year-month-day). Shown as "20 October 2026".
//   category     a short label, e.g. "Branding basics"
//   readingTime  minutes to read (about 200 words a minute)
//   intro        1–2 sentences: shown on the card, at the top of the article
//                and as the page's meta description (keep it under about 160 characters)
//   colors       two colours for the card's gradient art
//   body         the article, in order. Each "text in quotes" is one paragraph;
//                { heading: "..." } is a sub-heading. Inside a paragraph, write
//                a double quote as \" (otherwise JavaScript thinks the text has ended).
const POSTS = [
  {
    slug: "why-your-logo-is-not-your-brand",
    title: "Why your logo is not your brand",
    date: "2026-10-20",
    category: "Branding basics",
    readingTime: 2,
    intro: "A new logo can't fix a business people don't understand. Here's what a brand really is, and where the logo fits in.",
    colors: ["#7b2ff7", "#e0218a"],
    body: [
      "Almost every business owner who calls us starts the same way: \"We need a new logo.\" Sometimes they do. But often the real problem is bigger. Customers walk past, don't remember the name, or can't say what makes the business different from the shop next door.",
      "A logo is a signature. It's the mark that reminds people of everything else they know about you. If they know nothing else, the signature has nothing to remind them of.",
      { heading: "So what is a brand?" },
      "Your brand is what people say about you when you're not in the room. It's built from every small moment: how the phone is answered, how the bill looks, whether the delivery came on time, how your staff greet a regular customer, and what your signboard promises from across the road.",
      "The logo, colours and type are the visible part. They make those moments look like they belong to one business. That matters, because people trust what feels consistent.",
      "So before we draw anything, we ask three questions. Who do you want to come back? Why should they choose you over the nearest alternative? And what should they feel when they see your name? The answers decide the design. A sweet shop that wants to feel like a family tradition needs a very different logo from one that wants to feel quick and modern.",
      "A good logo, then, is not decoration. It's a short, memorable summary of a promise you keep every day. Get the promise clear first, and the logo becomes much easier to design, and much harder to forget.",
    ],
  },
  {
    slug: "will-people-read-your-signboard",
    title: "The five-second test: will people read your signboard?",
    date: "2026-09-22",
    category: "Advertising",
    readingTime: 2,
    intro: "Most people see a signboard or hoarding for less than five seconds. Five checks to make sure yours still gets its message across.",
    colors: ["#e0218a", "#ff9933"],
    body: [
      "A hoarding beside a busy road gets a glance, not a read. Someone on a scooter or in a car has a few seconds, and most of their attention is on the traffic. If your board needs longer than that, it is paying rent to be ignored.",
      "We use a simple test with clients: show the design for five seconds, hide it, and ask what it said. If they can't name the business and the one thing it offers, the design isn't finished.",
      { heading: "Five checks before you print" },
      "One message. Pick the single thing you want remembered: the name and one offer, or the name and one reason to visit. Phone number, address, five services and a discount all at once will cancel each other out.",
      "Big, simple letters. Fancy scripts and thin fonts disappear at a distance. As a rough guide, letters about 2.5 cm tall can be read from around 7 to 10 metres away, so a board seen from across a wide road needs letters many times taller.",
      "Strong contrast. Dark text on a light background, or light on dark. Red on green or blue on purple may look exciting on a screen, but they blur into one colour in sunlight and at night.",
      "Room to breathe. Empty space is not wasted space. It is what makes the words stand out. A crowded board looks cheap and reads slowly.",
      "Check it in place. Print a small version, stand where your customers will stand, at the time of day they'll pass, and look again. Ten minutes on the pavement can save the cost of a reprint.",
    ],
  },
  {
    slug: "choosing-brand-colours",
    title: "Choosing brand colours that work in print and on phones",
    date: "2026-08-25",
    category: "Design tips",
    readingTime: 2,
    intro: "The colour on your screen is not the colour on your visiting card. How to choose brand colours that stay true everywhere you use them.",
    colors: ["#ff9933", "#7b2ff7"],
    body: [
      "Colour is often the first thing people remember about a brand, before the name and long before the logo's details. That makes it worth choosing carefully, and worth checking in every place it will appear.",
      "The surprise for most clients is that one colour can look like three different colours: bright on a phone, duller on a printed flyer, and different again on a vinyl banner in the sun.",
      { heading: "Why colours change, and what to do about it" },
      "Screens make colour from light (RGB), while printers mix ink (CMYK). Some bright screen colours, especially vivid greens, oranges and electric blues, simply can't be printed with normal ink. They come out flatter. So we always choose and test brand colours in both worlds before we finalise them.",
      "Start small. One main colour, one supporting colour and a neutral (a near-black, a warm grey or an off-white) is enough for most businesses. More colours make a brand harder to recognise, not easier.",
      "Think about where you'll be seen. A colour that stands out in your street, at your counter or in a crowded social feed is worth more than one that is simply your favourite.",
      "Check that text stays readable. White text on a pale yellow or light green background looks fine to some people and is invisible to others. A good contrast check takes a minute and protects every poster, menu and post you'll ever make.",
      "Finally, write the colours down: the exact codes for screen and for print. Give that list to every printer and designer you work with. It's the cheapest way to make sure your brand looks the same in every place.",
    ],
  },
  {
    slug: "plan-your-festival-campaign-early",
    title: "Plan your festival-season campaign before the rush",
    date: "2026-07-28",
    category: "Social media",
    readingTime: 2,
    intro: "Festival season is when small businesses can win the most customers, and when printers and designers are busiest. A simple plan to start early.",
    colors: ["#e0218a", "#7b2ff7"],
    body: [
      "For many shops, the weeks from Navratri to Diwali bring a large share of the year's sales. They also bring the busiest weeks for printers, sign makers and designers. Businesses that start planning in October often find the good slots already taken.",
      "Starting two to three months early doesn't mean doing more work. It means doing the same work calmly, with time to fix mistakes.",
      { heading: "A simple timeline" },
      "Ten to twelve weeks before: decide your one offer. A festival gift box, a combo price, free delivery in your area. One clear offer is easier to advertise than five small ones.",
      "Eight weeks before: plan where people will see it. Your shop front, a banner, a flyer, your WhatsApp status and your social media posts should all show the same offer in the same colours, so each one reminds people of the others.",
      "Six weeks before: finish the designs and print a test copy. Check spelling, prices, dates and your phone number twice. A wrong number on a thousand flyers is an expensive mistake.",
      "Four weeks before: order printing, and schedule your posts. Most social media apps let you set posts to go out on a chosen date, so the campaign runs even on the busiest days at the counter.",
      "During the festival: watch what works. Ask new customers where they heard about you. Next year, you'll know exactly where to spend.",
    ],
  },
];
