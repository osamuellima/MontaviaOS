# Edits: before, after, why

Corrections that were actually made to films, in prose, from the generation-1 edit log (an earlier generation's private edit log, 18 entries; judge = a blind Claude judge, user = the user) plus the generation-2 notes. A before/after pair is a better teacher than a score. Read it at step 0, and read each lesson with its context: it generalises only as far as the reason does. Add yours: film, beat, before, after, why, who said so.

## Substance: a pipeline is not a film

- **A setup with no payoff.** Astra4 typed a prompt ("Fill out my tax return.") and cut away. The judge: "the task it starts never gets done". After: the answer or result is on screen right after the prompt. Rule of thumb: every prompt, claim or toggle the film starts is answered on screen.
- **Official words over stock words.** Astra4 used a stock AI-launch line ("A new generation of intelligence."); the rival film built on the brand's own launch line, verbatim, scored 7 for concept against 4. After: the brand's real phrasing, quoted exactly. Stock tagline copy is the cheapest tell there is.
- **Type-only film lost to a film with the brand's own picture.** Astra3 had no proof beat and lost 41 to 56 against a film that used the brand's launch photograph. After: the official key visual or the real UI as the picture. Removing slop tells without adding material gave a clean, hollow film (astra3 and astra4 both lost). This is why v2 builds every ground from the capture (`taste/verdicts.md`, "Too sparse").
- **Tasks named, not shown.** Astra v1 flashed capabilities as small labels at random positions for 0.4 s each ("the tasks are named but never shown"). After: one demonstration beat per claim, real UI or a task visibly completing, 1 to 1.5 s, large, at a fixed position.
- **Brand colour from CSS, not from the brand.** Astra3 took a generic blue from the site CSS for a monochrome brand and the blue "read as another company's brand". After: monochrome brand, monochrome film (near-black, white, light). Verify the accent on the board, not in the token list.
- **The name in the house typeface, lit by light.** The without-skill film set the product name in a different wide grotesk with blown-out bloom: "a new 'epic' typeface plus glow reads as a pasted-in template title". After: the name in the brand's own face, light rather than bloom.

## Scale, space, holding

- **A small line on a flat colour is a slide.** Astra3 set a 6-word line small on a flat blue field and buried the payoff word mid-line. After: two big lines, or give the key word its own full-frame beat, on a lit field. A second instance (opus55-v1): short text small on a huge colour field held 4 s, "clean but timid". After: display-size type (96 px and up) or an object on the field; hold equals reading time plus a second. Note the later correction to this: size is spent once (`judgment.md` section 4), and a small line is right when it is the quiet half of a contrast.
- **A static end card read as "the film gave up".** Astra3 held a logo for 6 s, 40 percent of the runtime. After: a 2 to 3 s lockup and the time spent on a proof beat. The same failure recurred in Resend v1 (about 5 s). v2 ceiling: resolved hold 0.6 to 1.4 s, CTA at most a quarter of the film.
- **Inflated UI type turns a product into a slide.** Kiln: UI text was blown up to 33 px and more so the card read at 1080p. After: UI type at real size (15 to 17 pt) and the camera goes macro on the one element. Humans make UI readable by moving the camera, not by resizing the interface. This is the root of gate G1.
- **Numbers.** Count-up tickers with 10 px benchmark labels are "AI-template tells". After: one number, big, with its unit; count-up only when the change is the point; labels 24 px and up. A 440 px number at 43 percent of the width was later pushed to 510 px at 50 percent: the number is the hero, with glyph separation (`type.md`).
- **A 0.2 s "tension beat" as its own scene** was replaced by a sound dip inside a longer held beat. Minimum visual beat is 0.5 s; anticipation belongs to sound.

## Looking real

- **"This looks vibe-coded" (user, Kiln).** Before: a phone outline on near-black holding "Good morning", a dark rounded card "dot Rent in 3 days . $1,450" and a loose "$42". After: a real lock screen (icon, title, time, body) drops in, then a macro push onto the notification; the app screen dense (status bar, large title, grouped rows, tab bar) on the product's own light surface. Why: a dot, a label and a muted value on a dark grey card is the component-library default every AI mock shares; real references show UI with identity, real chrome and density, framed small-in-context or macro. Recorded as the standing rule: no generic web-component cards.
- **Same floor glow under every scene reads as a template.** After: a plain tinted base, light only where it means something (an event, a source).

## Sound

- **Music that ignores the edit scored 5 against 7** for a score synced to the picture. Before: a steady drone and a kick pumping through every cut. After: the arrangement changes at scene cuts, silence before the reveal, SFX on on-screen events. Later refined: not a hit on every cut; one to three hand-placed hits and a dip of 8 to 15 dB before the big move.
- **Headroom and displaced changes** (opus55-astra-updated): AAC at 0.0 dBTP and sound changes landing exactly on 60 percent of cuts became extra mastering headroom and non-hero musical changes moved off the cuts, so the edit does not sound metronomic.

## Plumbing lessons that shipped films blank

- **`tl.set(el, {opacity:0}, 0)` written after the `fromTo` on the same element at the same time.** On a direct seek the later set wins; parallel render workers jump into the film, so a whole scene rendered blank from 1.2 s on. After: initial-state set before the tween, or omitted when t0 is 0. The v2 runtime sets first values itself; run `Motion.selfTest(M)` and look at the render, because a blank scene passes every lint.

## Generation 2 and the first motionmaxxing test (2026-09-29 to 2026-10-05)

- **Killing page chrome was the biggest single jump** (9 of 10 user picks, 09-29 to 09-30). Header bars, kickers, left headline plus phone, footer CTA with an arrow: remove them and give the picture a job.
- **Carry one real material.** The spotify build that carried real cover art from prompt to feed to logo beat the same brief with a headline and a phone, and beat a code-drawn version.
- **Calm legible over frantic** (u5 Halftone): the user picked the calm film. After: pick the energy the brand has; human films' median motion is 6.8 on the look.py scale, the with-skill films averaged 11.7.
- **A chrome-free film can still be hollow.** The v1 Wispr test had no left headline in the final render but did have label chips, five flat swatches, one generic card for 7 s and a web-footer end (`verdicts.md`). After: build from the capture (media plates, product screens), cap the hold on any one object, end on the name.
- **Self-certification fails silently.** A 15 s black render was once reported "VERIFIED / CLEAN" because the lint it ran only read source. After: gates are computed on the render by scripts the agent cannot edit, the agent describes each sheet frame in one sentence, and NOTE.md quotes the numbers.

## Generation 3: the first vertical Reels (Montavia, 2026-10-16/17; 36 s, 1080x1920)

Corrections made while building one 9:16 Reels. No user verdict on the film is stored here (the user had not reacted yet); "who said so" is the script or the check that caught it, not taste.

- **A queue of cards cropped by the bottom edge failed G5.** Before: while the camera rose to the back of a card queue, cards and the terracotta gate sat in the bottom band (`lint.mjs` C1 x3, C6 x20: "footer list"). After: the pile sinks out of frame as the camera rises and comes back during the pull-back; the card framing moved up. Why: the outer-band rules do not know cropped content from chrome, and in 9:16 that band is also where the platform UI draws. Who: `lint.mjs`.
- **`enter` after `exit` on one element sent the element to the `enter`'s `from` pose from frame 0** (the gate sat 300 px low for 4 s). Cause: `exit` never fixed the frame-0 pose, so the later `enter` won. After: `exit` owns frame 0 too (earliest segment wins); `examples/selftest` fails on the old runtime and passes on the new; the shipped Reels renders byte-identical. Who: `lint.mjs` showing a bar where none should be, then the stills.
- **An empty frame between two beats.** Before: the pile left at frame 126 and the first card dropped at 146 (0.6 s of bare ground, still counted as motion by the average). After: the first card starts dropping while the pile sinks. Who: the contact sheet (4.6 s), not `look.py` (which only flags runs of flat frames).
- **Card text was 70 px on a 1920 frame (0.036 H), below G1's 0.04 H.** Before: 48 px of world text x 1.45 camera. After: 52 px x 1.5 = 78 px. Why: magnify with the camera, but check the product of font size and zoom, not the font size.
- **Sizes within 1.25 of each other read as a flat hierarchy** (design hook). Before: 100/84/80/72/66/60 px. After: 108/84/64/52/26 px, one role each.
- **A film-average reading pace hid a sentence nobody could read.** Before: "131 words in 36 s = 3.6 w/s, normal for Reels". After `scripts/reading.mjs`: a 12-word hook at 5.0 w/s, a 11-word line at 6.6 w/s, two more over 4.0. Lesson: measure per sentence (first word -> exit) and keep a 0.5-1 s tail after the last word. The first fix (hold more on the three pain cards) was made by hand, before the script existed, and still left the fastest lines untouched.
- **Safe zones for Instagram are not a settled number.** Sources give top 108-270 px and bottom 250-670 px; Meta's own page was not found. The template carries two levels (minimum, conservative) and says to confirm in the app preview. Do not hard-code a single figure as fact.
