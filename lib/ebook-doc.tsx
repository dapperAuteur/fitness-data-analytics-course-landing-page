import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const colors = {
  brand: "#0891b2",
  brandDark: "#0e7490",
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  surface: "#f1f5f9",
  rule: "#cbd5e1",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingHorizontal: 56,
    paddingBottom: 64,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: colors.body,
    lineHeight: 1.55,
  },
  brandStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: colors.brand,
  },
  eyebrow: {
    fontSize: 9,
    color: colors.brandDark,
    letterSpacing: 1.4,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  h1: {
    fontSize: 26,
    color: colors.ink,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 22,
  },
  h2: {
    fontSize: 16,
    color: colors.ink,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 8,
  },
  h3: {
    fontSize: 12,
    color: colors.brandDark,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 8,
  },
  metricCard: {
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 10,
    color: colors.brand,
  },
  bulletText: {
    flex: 1,
  },
  callout: {
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    paddingLeft: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    marginTop: 10,
    marginBottom: 14,
  },
  footer: {
    position: "absolute",
    left: 56,
    right: 56,
    bottom: 28,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    fontSize: 9,
    color: colors.muted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const Bullet = ({ children }: { children: string }) => (
  <View style={styles.bullet}>
    <Text style={styles.bulletDot}>{"•"}</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Footer = ({ pageNumber }: { pageNumber: number }) => (
  <View style={styles.footer} fixed>
    <Text>FDAC · Foundations of Fitness and Health Metrics · Free 3-page guide</Text>
    <Text>{pageNumber} / 3</Text>
  </View>
);

export function FoundationsEbookDoc() {
  return (
    <Document
      title="Foundations of Fitness and Health Metrics — 3-page guide"
      author="Brand Anthony McDonald"
      subject="The four metrics that matter most for healthy aging"
      creator="FDAC (fdac.witus.online)"
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandStripe} fixed />
        <Text style={styles.eyebrow}>FDAC · Free 3-page guide</Text>
        <Text style={styles.h1}>Foundations of Fitness and Health Metrics</Text>
        <Text style={styles.subtitle}>
          Your complete guide to getting started with health data. Plain language. No medical
          background required.
        </Text>

        <Text style={styles.h2}>The four numbers that matter most</Text>
        <Text style={styles.paragraph}>
          Most wearable apps surface dozens of metrics. Four of them carry the most signal for
          healthy aging — and they are the four we focus the rest of this course around. Read each
          card below for what it is, why it matters, and the rough target ranges to start with.
        </Text>

        <View style={styles.metricCard}>
          <Text style={styles.h3}>1. Resting heart rate (RHR)</Text>
          <Text>
            Your heart&apos;s baseline beats-per-minute when you&apos;re calm. A lower RHR usually means
            a stronger, more efficient cardiovascular system. Healthy adult ranges land between
            roughly 50 and 80 BPM, with trained athletes often below 50.
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.h3}>2. Daily steps</Text>
          <Text>
            A simple, durable proxy for movement. The often-quoted 10,000-step goal is more
            convention than science — what matters more is the trend: are you trending up week-over-
            week, or sliding down? Pick a baseline that fits your life and aim for steady increase.
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.h3}>3. Sleep quality (not just quantity)</Text>
          <Text>
            Hours in bed is necessary but not sufficient. Sleep efficiency (% of in-bed time
            actually asleep), wake-after-sleep-onset, and time spent in deep + REM stages tell a
            richer story. Most consumer wearables now estimate these reasonably well.
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.h3}>4. Intensity minutes</Text>
          <Text>
            How long you spend at moderate or vigorous heart rate. The current evidence-based target
            is 150 moderate + 75 vigorous minutes per week — the dose linked to ~50% lower
            all-cause mortality in cohort studies.
          </Text>
        </View>

        <Footer pageNumber={1} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandStripe} fixed />
        <Text style={styles.eyebrow}>Page 2 · How to read your dashboard</Text>
        <Text style={styles.h1}>Reading your body&apos;s daily signals</Text>
        <Text style={styles.subtitle}>
          Numbers in isolation are noise. Numbers in context tell a story.
        </Text>

        <Text style={styles.h2}>Three rules for reading your wearable data</Text>

        <Text style={styles.h3}>Rule 1 · Trend over today</Text>
        <Text style={styles.paragraph}>
          Single-day numbers fluctuate with caffeine, alcohol, stress, hydration, and the placement
          of your wearable. The seven-day rolling average filters that noise. When you check your
          metrics, look at the trend line first, today&apos;s value second.
        </Text>

        <Text style={styles.h3}>Rule 2 · Direction over absolute value</Text>
        <Text style={styles.paragraph}>
          A resting heart rate of 68 BPM is neither &quot;good&quot; nor &quot;bad&quot; in isolation. What matters
          is which direction it&apos;s moving. RHR trending down over weeks and months is one of the
          clearest signals that your training is working.
        </Text>

        <Text style={styles.h3}>Rule 3 · One change at a time</Text>
        <Text style={styles.paragraph}>
          When a metric moves, change one input — sleep schedule, hydration, training load — and
          give it two weeks before you change anything else. This is how you learn what actually
          works for your body, instead of guessing.
        </Text>

        <View style={styles.callout}>
          <Text style={styles.h3}>The 80/20 of intensity minutes</Text>
          <Text>
            Hitting 150 moderate minutes weekly is mostly a scheduling problem, not a fitness one.
            Three 30-minute walks at a brisk pace + two slightly harder sessions clears the bar for
            most people. The course covers exactly how to dial this in for your equipment and your
            schedule.
          </Text>
        </View>

        <Footer pageNumber={2} />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandStripe} fixed />
        <Text style={styles.eyebrow}>Page 3 · Action plan</Text>
        <Text style={styles.h1}>Your first two weeks</Text>
        <Text style={styles.subtitle}>
          A short on-ramp anyone with a wearable can run this week.
        </Text>

        <Text style={styles.h2}>Days 1–3 · Establish baseline</Text>
        <Text style={styles.paragraph}>Wear the device every day, do nothing different.</Text>
        <Bullet>Capture resting heart rate (morning, before coffee).</Bullet>
        <Bullet>Capture daily steps without aiming at any number.</Bullet>
        <Bullet>Capture sleep efficiency and total time asleep.</Bullet>
        <Bullet>Note any intensity minutes you happen to accumulate.</Bullet>

        <Text style={styles.h2}>Days 4–7 · Pick one lever</Text>
        <Text style={styles.paragraph}>
          Choose one metric to nudge. For most people the highest-leverage starting point is sleep:
          consistent bedtime + 7 hours minimum. Track for the rest of week 1.
        </Text>

        <Text style={styles.h2}>Days 8–14 · Add intensity minutes</Text>
        <Text style={styles.paragraph}>
          Layer in 3 walks of 25 minutes at brisk pace. Pace is brisk if you can speak in short
          phrases but not full sentences. Your wearable will start logging moderate intensity
          minutes on these. Don&apos;t worry about hitting 150/75 in week 2 — half is fine.
        </Text>

        <View style={styles.callout}>
          <Text style={styles.h3}>What comes next</Text>
          <Text>
            FDAC is the 5-week course that builds on these foundations: device validation, pattern
            recognition, intensity-minute dialing, long-term trend interpretation, and a personal
            optimization protocol. Enrollment opens after you&apos;re on the waitlist.
          </Text>
          <Text style={{ marginTop: 6 }}>
            Brand Anthony McDonald · fdac.witus.online · centenarianos.com
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 14, fontSize: 9, color: colors.muted }]}>
          Educational content for healthy adults. Not medical advice. © {new Date().getFullYear()} B4C LLC. All rights reserved.
        </Text>

        <Footer pageNumber={3} />
      </Page>
    </Document>
  );
}
