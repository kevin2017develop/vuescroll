import { getComplitableStyle, getVnodeInfo } from 'shared/util';
import { __REFRESH_DOM_NAME, __LOAD_DOM_NAME } from 'shared/constants';
export function getPanelData(context) {
  // scrollPanel data start
  const data = {
    ref: 'scrollPanel',
    style: {},
    class: [],
    nativeOn: {
      scroll: context.handleScroll
    },
    props: {
      ops: context.mergedOptions.scrollPanel
    }
  };

  data.class.push('__slide');

  let width = getComplitableStyle('width', 'fit-content');
  if (width) {
    data.style['width'] = width;
  } /* istanbul ignore next */ else {
    data['display'] = 'inline-block';
  }

  if (context.mergedOptions.scrollPanel.padding) {
    data.style.paddingRight = context.mergedOptions.rail.size;
  }

  return data;
}

export function getPanelChildren(h, context) {
  let renderChildren =
    getVnodeInfo(context.$slots['scroll-panel']).ch || context.$slots.default;

  for (let i = 0; i < renderChildren.length; i++) {
    const key = renderChildren[i].key;
    if (key === __LOAD_DOM_NAME || key === __REFRESH_DOM_NAME) {
      renderChildren.splice(i, 1);
      i--;
    }
  }

  // handle refresh
  if (context.mergedOptions.vuescroll.pullRefresh.enable) {
    renderChildren.unshift(
      <div
        class={{ __refresh: true, __none: !context.isEnableRefresh() }}
        ref={__REFRESH_DOM_NAME}
        key={__REFRESH_DOM_NAME}
      >
        {[createTipDom(h, context, 'refresh'), context.pullRefreshTip]}
      </div>
    );
  }

  // handle load
  if (context.mergedOptions.vuescroll.pushLoad.enable) {
    renderChildren.push(
      <div
        ref={__LOAD_DOM_NAME}
        key={__LOAD_DOM_NAME}
        class={{ __load: true, __none: !context.isEnableLoad() }}
      >
        {[createTipDom(h, context, 'load'), context.pushLoadTip]}
      </div>
    );
  }

  return context.$slots.default;
}

// Create load or refresh tip dom of each stages
function createTipDom(h, context, type) {
  const stage = context.vuescroll.state[`${type}Stage`];
  let dom = null;
  // Return user specified animation dom
  /* istanbul ignore if */
  if ((dom = context.$slots[`${type}-${stage}`])) {
    return dom[0];
  }

  switch (stage) {
  // The dom will show at deactive stage
  case 'deactive':
    dom = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000"
        xmlSpace="preserve"
      >
        <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
        <g>
          <g transform="matrix(1 0 0 -1 0 1008)">
            <path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z" />
          </g>
        </g>
      </svg>
    );
    break;
  case 'start':
    dom = (
      <svg viewBox="0 0 50 50" class="start">
        <circle stroke="true" cx="25" cy="25" r="20" class="bg-path" />
        <circle cx="25" cy="25" r="20" class="active-path" />
      </svg>
    );
    break;
  case 'active':
    dom = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000"
        xmlSpace="preserve"
      >
        <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
        <g>
          <g transform="matrix(1 0 0 -1 0 1008)">
            <path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z" />
          </g>
        </g>
      </svg>
    );
    break;
  case 'beforeDeactive':
    dom = (
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3562"
      >
        <path
          d="M512 0C229.706831 0 0 229.667446 0 512s229.667446 512 512 512c282.293169 0 512-229.667446 512-512S794.332554 0 512 0z m282.994215 353.406031L433.2544 715.145846a31.484062 31.484062 0 0 1-22.275938 9.231754h-0.4096a31.586462 31.586462 0 0 1-22.449231-9.814646L228.430769 546.327631a31.507692 31.507692 0 0 1 45.701908-43.386093l137.4208 144.785724L750.442338 308.854154a31.507692 31.507692 0 1 1 44.551877 44.551877z"
          fill=""
          p-id="3563"
        />
      </svg>
    );
    break;
  }
  return dom;
}

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} context
 * @returns
 */
export function createPanel(h, context) {
  let data = getPanelData(context);

  return <scrollPanel {...data}>{getPanelChildren(h, context)}</scrollPanel>;
}
