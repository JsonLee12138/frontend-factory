import {
  Component,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import * as ALL_ICON from '@icon-park/svg/es/map';
import { debounce } from 'lodash';

const icons = Object.keys(ALL_ICON);

@Component({
  tag: 'select-iconpark',
  styleUrl: 'style.css',
  shadow: true,
})
export class SelectIconPark {
  @Prop() maskClosable: boolean = true;
  @Prop() escCloseable: boolean = true;
  @Prop() showClose: boolean = true;
  @Prop() show: boolean;
  @Prop() showDivider: boolean = true;
  @Prop() header: string = 'Icon Park 图标库';
  @Prop() width: string = '50%';
  @Prop() showFooter: boolean = true;
  @Prop() top: string = '15vh';
  @Prop() maxHeight: string = '80vh';
  @Prop() value: string = '';
  // @Prop() change: (v: string) => void;

  @Event() change: EventEmitter<string>;

  @State() iconKeys: string[] = icons;
  @State() itemsMarginRight: string = '';

  dialogInstance: HTMLJsonDialogElement;
  iconsRefs: Map<string, HTMLIconParkElement> = new Map();
  observer: IntersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLIconParkElement;
        target.load();
        if (!this.itemsMarginRight) {
          this.mathItemsMarginRight();
        }
      }
    }
  });

  constructor() {
    this.showChange = this.showChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.mathItemsMarginRight = this.mathItemsMarginRight.bind(this);
    this.hanleSelect = this.hanleSelect.bind(this);
  }

  connectCallback() {}

  componentDidLoad() {
    for (const [_key, instance] of this.iconsRefs) {
      this.observer.observe(instance);
    }
    window.addEventListener('resize', debounce(this.mathItemsMarginRight, 300));
  }

  disconnectedCallback() {
    this.observer.disconnect();
    window.removeEventListener('resize', this.mathItemsMarginRight);
  }

  private hanleSelect(e: MouseEvent, key: string) {
    e.stopPropagation();
    this.change.emit(key);
    // this.onChange?.(key);
    console.log(e, key, this.change);

    this.close();
  }

  private mathItemsMarginRight() {
    this.itemsMarginRight = 'auto';
    requestAnimationFrame(() => {
      this.itemsMarginRight = getComputedStyle(
        this.iconsRefs.get(icons[0]),
      ).marginRight;
    });
  }

  @Watch('show')
  private showChange(newValue?: boolean) {
    if (typeof newValue === 'undefined') {
      return;
    }
    if (newValue) {
      this.open();
      return;
    }
    this.close();
  }

  @Method()
  async open() {
    this.dialogInstance?.open();
  }
  @Method()
  async close() {
    this.dialogInstance?.close();
  }

  render() {
    return (
      <json-dialog
        ref={(el) => (this.dialogInstance = el)}
        header={this.header}
        showFooter={false}
        maskClosable={this.maskClosable}
        showClose={this.showClose}
        show={this.show}
        showDivider={this.showDivider}
        top={this.top}
        maxHeight={this.maxHeight}
        width={this.width}
      >
        <div class={'flex w-full flex-wrap items-center'}>
          {icons.map((item) => (
            <icon-park
              cusLoad
              name={item}
              ref={(el) => this.iconsRefs.set(item, el)}
              size={24}
              class={`${!this.iconKeys.includes(item) && 'hidden'} p-5 mr-auto hover:scale-150 transition cursor-pointer`}
              style={{ marginRight: this.itemsMarginRight }}
              onClick={(e) => this.hanleSelect(e, item)}
            ></icon-park>
          ))}
        </div>
      </json-dialog>
    );
  }
}
