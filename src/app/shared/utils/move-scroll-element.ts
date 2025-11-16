export function onHandleScrollFilters(element: string) {
  setTimeout(() => {
    const chipElement = document.getElementById(`${element}`);
    chipElement!.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  }, 200);
}
