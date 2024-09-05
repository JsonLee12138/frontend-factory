import { Component, Method, Prop, State, Watch, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'json-dialog',
  styleUrl: 'style.css',
  shadow: true,
})
export class SelectIconPark {
  @Prop() maskClosable: boolean = true;
  @Prop() escCloseable: boolean = true;
  @Prop() showClose: boolean = true;
  @Prop() show: boolean;
  @Prop() showDivider: boolean = true;
  @Prop() header: string = '';
  @Prop() width: string = '50%';
  @Prop() showFooter: boolean = true;
  @Prop() confirmText: string = '确定';
  @Prop() cancelText: string = '取消';
  @Prop() top: string = '15vh';
  @Prop() maxHeight: string = '80vh';
  @Prop() showMask: boolean = true;

  @Event() afterClose: EventEmitter<undefined>;

  @State() bodyMaxHeight = this.maxHeight;
  @State() headerHeight = 0;
  @State() footerHeight = 0;
  dialogInstance: HTMLDialogElement;
  headerInstance: HTMLElement;
  footerInstance: HTMLElement;
  private padding: string = '20px';

  constructor() {
    this.handleClickMask = this.handleClickMask.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.showChange = this.showChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleKeyDown = this.handleClickMask.bind(this);
    this.mathBodyHeight = this.mathBodyHeight.bind(this);
  }

  componentDidLoad() {
    window.addEventListener('keydown', this.handleKeyDown);
    requestAnimationFrame(() => {
      this.headerHeight = this.headerInstance.clientHeight;
      this.footerHeight = this.footerInstance?.clientHeight || 0;
      this.mathBodyHeight();
    });
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      if (this.escCloseable) {
        this.close();
      }
    }
  };

  @Watch('maxHeight')
  private mathBodyHeight() {
    this.bodyMaxHeight = `calc(${this.maxHeight} - ${this.headerHeight + this.footerHeight}px - ${this.padding} * 2)`;
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
    this.dialogInstance?.show();
  }
  @Method()
  async close() {
    this.dialogInstance?.close();
    this.afterClose.emit();
  }

  private handleClickMask() {
    if (this.maskClosable) {
      this.close();
    }
  }

  private stopPropagation(e: Event) {
    e.stopPropagation();
  }

  render() {
    return (
      <dialog
        ref={(el) => (this.dialogInstance = el)}
        class={'border-none w-screen h-screen top-0 bg-transparent fixed z-[9999]'}
      >
        <div
          class={`w-full h-full overflow-hidden ${this.showMask && 'mask'}`}
          onClick={this.handleClickMask}
        >
          <div
            class={
              'bg-white mx-auto rounded overflow-hidden shadow p-4 relative max-h-[80vh]'
            }
            style={{ width: this.width, marginTop: this.top }}
            onClick={this.stopPropagation}
          >
            {this.showClose && (
              <button
                class={
                  'absolute top-4 right-4 outline-none hover:rotate-180 origin-center transition text-gray-400'
                }
                onClick={this.close}
              >
                <icon-park name="close"></icon-park>
              </button>
            )}
            {/* header */}
            <section
              class={`${this.showDivider ? 'border-b' : ''} min-h-6 pb-2`}
              ref={(el) => (this.headerInstance = el)}
            >
              <h1>{this.header}</h1>
            </section>
            {/* body */}
            <section
              style={{ maxHeight: this.bodyMaxHeight }}
              class={'overflow-y-auto'}
            >
              <slot>
                <div class={'py-3'}></div>
              </slot>
            </section>
            {this.showFooter && (
              <section
                class={`${this.showDivider ? 'border-t' : ''} min-h-6 pt-2`}
                ref={(el) => (this.footerInstance = el)}
              >
                <slot name="footer">
                  <div class={'flex justify-end items-center'}>
                    <button
                      class={
                        'text-blue-600 font-semibold py-2 px-4 border border-blue-600 rounded hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                      }
                    >
                      {this.cancelText}
                    </button>
                    <button
                      class={
                        'bg-blue-600 text-white font-semibold py-2 px-4 border border-blue-600 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ml-3'
                      }
                    >
                      {this.confirmText}
                    </button>
                  </div>
                </slot>
              </section>
            )}
          </div>
        </div>
      </dialog>
    );
  }
}
