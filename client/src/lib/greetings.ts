export default function greetings() {
  const hour: any = new Date().getHours();

  return hour < 12
    ? "Good Morning"
    : hour < 18
      ? "Good Afternoon"
      : hour < 21
        ? "Good Evening"
        : "Good Night";
}