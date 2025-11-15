import { TypeCommonFn } from '@/d.types/common'

export interface DraggableOption {
  el: HTMLElement,
  zIndex?: number;
  isScale?: boolean;
  minSize?: [number, number];
  maxSize?: [number, number];
  draggableCb?: TypeCommonFn;
  scaleCb?: TypeCommonFn;
  [key: string]: any;
}

export class Draggable {
  #element: HTMLElement
  #isDragging: boolean = false;
  #isScale: boolean = false;
  #offsetX: number = 0
  #offsetY: number = 0
  #diffX: number = 0
  #diffY: number = 0
  #position: [number, number] = [0, 0];
  #size: [number, number] = [0, 0];
  #zIndex: number = 1000;
  #canScale: boolean = true;
  #minSize: DraggableOption['minSize'] = [50, 50];
  #maxSize: DraggableOption['maxSize'] = [window.innerWidth, window.innerHeight];
  #option: DraggableOption

  constructor(option: DraggableOption) {
    this.#element = option.el
    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = this.#element;
    this.#position = [offsetLeft, offsetTop];
    this.#size = [offsetWidth, offsetHeight];
    this.#zIndex = option.zIndex || this.#zIndex;
    this.#canScale = option.isScale ?? this.#canScale;
    this.#minSize = option.minSize ?? this.#minSize;
    this.#maxSize = option.maxSize ?? this.#maxSize;
    this.#option = option;
    this.#bindEvent()
  }

  #bindEvent() {
    this.#element.addEventListener('mousedown', this.#onMouseDown.bind(this))
    document.addEventListener('mousemove', this.#onMouseMove.bind(this))
    document.addEventListener('mouseup', this.#onMouseUp.bind(this))
  }

  #onMouseDown(event: MouseEvent) {
    const rect = this.#element.getBoundingClientRect()
    this.#offsetX = event.clientX - rect.left
    this.#offsetY = event.clientY - rect.top
    this.#diffX = rect.left + this.#size[0] - event.clientX
    this.#diffY = rect.top + this.#size[1] - event.clientY

    if (this.#canScale && this.#diffX <= 10 && this.#diffY <= 10) {
      this.#isScale = true;
    } else {
      this.#isDragging = true;
    }
    this.#element.style.position = 'absolute'
    this.#element.style.zIndex = this.#zIndex.toString();
  }

  #onMouseMoveDragging(e: MouseEvent) {
    if (!this.#isDragging) return
    let x = e.clientX - this.#offsetX
    let y = e.clientY - this.#offsetY

    // 限制拖拽范围在窗口内
    const maxX = window.innerWidth - this.#size[0]
    const maxY = window.innerHeight - this.#size[1]

    if (x < 0) {
      x = 0
    }
    if (x > maxX) {
      x = maxX
    }

    if (y < 0) {
      y = 0
    }
    if (y > maxY) {
      y = maxY
    }


    this.#position[0] = x;
    this.#position[1] = y;

    this.#element.style.left = `${ x }px`
    this.#element.style.top = `${ y }px`
    this.listenDragging(this.#option.draggableCb);
  }

  #onMouseMove(event: MouseEvent) {
    this.#onMouseMoveDragging(event);

    this.#onMouseMoveScaling(event);
  }

  #onMouseMoveScaling(event: MouseEvent) {
    if (!this.#isScale) {
      return;
    }

    let width = event.clientX - this.#position[0];
    let height = event.clientY - this.#position[1];

    const [minWidth, minHeight] = this.#minSize!;
    const [maxWidth, maxHeight] = this.#maxSize!;

    if (width < minWidth) {
      width = minWidth;
    } else if (width > maxWidth) {
      width = maxWidth;
    }

    if (height < minHeight) {
      height = minHeight;
    } else if (height > maxHeight) {
      height = maxHeight;
    }

    this.#size[0] = width;
    this.#size[1] = height;
    this.#element.style.width = `${ width }px`
    this.#element.style.height = `${ height }px`
    this.listenScaling(this.#option.scaleCb);
  }

  #onMouseUp() {
    this.#isDragging = false
    this.#isScale = false;
  }

  listenDragging(cb?: TypeCommonFn) {
    if (this.#isDragging) {
      cb?.(this.#position)
    }
  }

  listenScaling(cb?: TypeCommonFn) {
    if (this.#isScale) {
      cb?.(this.#size)
    }
  }
}
