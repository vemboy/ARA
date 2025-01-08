declare module 'imagesloaded' {
  function imagesLoaded(
    elem: Element | Element[] | NodeList | string,
    callback?: (instance: any) => void
  ): any;

  export default imagesLoaded;
}
