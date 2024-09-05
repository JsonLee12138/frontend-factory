import { Component, Method, Prop, h } from "@stencil/core";
import { ISvgIconProps, Theme } from "@icon-park/svg/lib/runtime";
import * as ALL_ICON from '@icon-park/svg/es/map';
import { camelCase } from "../../utils/str";

@Component({
  tag: 'icon-park',
  styleUrl: 'style.css',
  shadow: true
})
export class JIcon {
  @Prop() name: string;
  @Prop() theme: Theme;
  @Prop() size: number | string;
  @Prop() spin: boolean;
  @Prop() fill: string | string[];
  @Prop() strokeLinecap: ISvgIconProps['strokeLinecap'];
  @Prop() strokeLinejoin: ISvgIconProps['strokeLinejoin'];
  @Prop() strokeWidth: ISvgIconProps['strokeWidth'];
  @Prop() cusLoad: boolean = false;
  @Prop() class: string;

  instance: HTMLElement;

  constructor(){
    this.getIcon = this.getIcon.bind(this);
    this.load = this.load.bind(this);
  }

  private getIcon(): string {
    const [_name, _theme] = this.name.split('/');
    const name = camelCase(_name, true);
    const theme = this.theme || _theme;
    if(Object.keys(ALL_ICON).includes(name)){
      return ALL_ICON[name]({
        theme,
        size: this.size,
        spin: this.spin,
        fill: this.fill,
        strokeLinecap: this.strokeLinecap,
        strokeLinejoin: this.strokeLinejoin,
        strokeWidth: this.strokeWidth
      });
    }
    return "<slot />"
  }

  @Method()
  async load(){
    this.instance.innerHTML = this.getIcon();
  }

  componentDidLoad(){
    if(!this.cusLoad){
      this.load();
    }
  }

  render() {
    return <i class={this.class} ref={el => this.instance = el}></i>;
  }
}
