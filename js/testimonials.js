/* =========================================================
   Trinetra Creations: testimonial data (Day 11)
   ONE list holds every client quote shown on the Home page.
   This file only stores data; js/testimonials-carousel.js
   turns it into the list / carousel.

   !!! EVERY NAME, BUSINESS AND QUOTE BELOW IS A SAMPLE !!!
   ========================================================= */

// Master switch: true = show a "Sample" badge next to the section title.
// Set to false once the quotes below are real.
const SHOW_SAMPLE_TESTIMONIALS = true;

// One object per quote. Fields:
//   quote     what the client said (keep it under about 40 words, so it fits on a phone)
//   name      the person's name
//   role      their job title
//   business  their business name
// Order here = order on the page. To add a quote, copy one { ... }, block
// (including the comma after it) and change the text.
const TESTIMONIALS = [
  {
    quote: "We had a name and a rough sketch. Trinetra gave us a logo our customers now recognise from across the street, and the new signboard brought in walk-ins in the first week.",
    name: "Neha Kulkarni",
    role: "Owner",
    business: "Gulmohar Bakery",
  },
  {
    quote: "They asked questions nobody had asked us before: who buys, why, and what they compare us with. The brochure that came out of it finally sounds like us.",
    name: "Rajesh Agarwal",
    role: "Director",
    business: "Pawan Steel",
  },
  {
    quote: "Our site hoardings used to look like everyone else's. The new campaign was simple, bold and easy to read from a moving car. Enquiries were up within a month.",
    name: "Sanjay Verma",
    role: "Sales Head",
    business: "Aarav Realty",
  },
  {
    quote: "Ashutosh and the team planned a month of posts in one meeting. We stopped guessing what to post, and the feed looks like one brand at last.",
    name: "Pooja Menon",
    role: "Co-founder",
    business: "Tulsi Organics",
  },
  {
    quote: "Clear prices after the free consultation, no surprises, and every proof arrived when they said it would. We have already come back for our festival campaign.",
    name: "Imran Sheikh",
    role: "Managing Partner",
    business: "Sangam Travels",
  },
];
