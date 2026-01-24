# Typography System Guide

## Typography Hierarchy

### 1. **Hero/Display Text** (Main Headlines)

- **Size**: `text-4xl tablet:text-5xl laptop:text-6xl laptopl:text-7xl`
- **Weight**: `font-bold`
- **Use**: Main page hero, primary headlines
- **Example**: "Run Berlin, Your Way."

### 2. **Section Headings** (H2)

- **Size**: `text-2xl tablet:text-3xl laptop:text-4xl`
- **Weight**: `font-bold`
- **Spacing**: `mb-12 laptop:mb-16`
- **Use**: Major section titles like "Our Activities", "About", "Follow us on Instagram"
- **Example**: "Our Activities", "Why we run"

### 3. **Subsection Headings** (H3)

- **Size**: `text-xl tablet:text-2xl laptop:text-3xl`
- **Weight**: `font-bold` or `font-semibold`
- **Use**: Sub-sections, card titles
- **Example**: Team member names, activity titles

### 4. **Lead/Intro Paragraphs** (Supporting text under headings)

- **Size**: `text-base tablet:text-lg laptop:text-xl`
- **Weight**: `font-normal`
- **Opacity**: `opacity-80` to `opacity-90`
- **Line Height**: `leading-relaxed`
- **Use**: Introductory text, descriptions under headings
- **Example**: "Here's what our community looks like in real life."

### 5. **Body Text** (Main content)

- **Size**: `text-base tablet:text-lg laptop:text-xl`
- **Weight**: `font-normal`
- **Opacity**: `opacity-80` to `opacity-90`
- **Line Height**: `leading-relaxed`
- **Use**: Main content paragraphs, descriptions
- **Example**: Activity descriptions, about paragraphs

### 6. **Small Text** (Captions, metadata)

- **Size**: `text-sm tablet:text-base`
- **Weight**: `font-normal`
- **Opacity**: `opacity-70` to `opacity-80`
- **Use**: Captions, dates, small labels

## Typography Rules

### Spacing Rules

- **After H1**: `mb-4 laptop:mb-6` (tight, for hero)
- **After H2**: `mb-12 laptop:mb-16` (generous, for sections)
- **After H3**: `mb-4 laptop:mb-6` (moderate)
- **Paragraph spacing**: `mb-6 laptop:mb-8` or use `space-y-6 laptop:space-y-8` for multiple paragraphs
- **Section spacing**: `mt-16 laptop:mt-24` (between major sections)

### Width Rules

- **Hero text**: `max-w-3xl` (readable width)
- **Body paragraphs**: `w-full laptop:w-4/5` or `max-w-4xl` (comfortable reading)
- **Long content**: `max-w-4xl` (optimal reading width)

### Opacity Rules

- **Headings**: `opacity-100` (full contrast)
- **Lead paragraphs**: `opacity-90` (slightly muted)
- **Body text**: `opacity-80` to `opacity-90` (readable but secondary)
- **Muted text**: `opacity-70` (tertiary information)

### Line Height Rules

- **Headings**: `leading-tight` (compact)
- **Body text**: `leading-relaxed` (comfortable reading)
- **Long paragraphs**: `leading-relaxed` or `leading-7` (breathing room)

## Common Patterns

### Section Pattern

```jsx
<div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
  <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-12 laptop:mb-16">
    Section Title
  </h2>
  <p className="text-base tablet:text-lg laptop:text-xl w-full laptop:w-4/5 leading-relaxed opacity-90">
    Supporting description text
  </p>
  {/* Content */}
</div>
```

### Card Pattern

```jsx
<h3 className="text-xl tablet:text-2xl font-bold mb-4">
  Card Title
</h3>
<p className="text-base tablet:text-lg leading-relaxed opacity-70">
  Card description
</p>
```

## Responsive Breakpoints

- **Mobile**: Base size (e.g., `text-base`)
- **Tablet** (`768px`): `tablet:text-lg`
- **Laptop** (`1024px`): `laptop:text-xl`
- **Large Laptop** (`1440px`): `laptopl:text-2xl` (only for hero/display)

## Best Practices

1. **Maintain hierarchy**: Each level should be visually distinct
2. **Don't skip levels**: Go from H2 → H3, not H2 → H4
3. **Consistent spacing**: Use the same spacing patterns throughout
4. **Readable widths**: Limit line length for better readability
5. **Contrast**: Use opacity to create visual hierarchy, not just size
6. **Mobile first**: Start with smaller sizes, scale up for larger screens
