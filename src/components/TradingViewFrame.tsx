'use client';

import { useMemo } from 'react';

type Props = {
  symbol: string;
  title?: string;
};

export function TradingViewFrame({ symbol, title = 'Market Surface' }: Props) {
  const src = useMemo(() => {
    const config = encodeURIComponent(
      JSON.stringify({
        autosize: true,
        symbol,
        interval: 'D',
        timezone: 'America/Detroit',
        theme: 'dark',
        style: '1',
        locale: 'en',
        allow_symbol_change: true,
        withdateranges: true,
        hide_side_toolbar: false,
        save_image: false,
        details: true,
        hotlist: true,
        calendar: false,
      })
    );
    return `https://s.tradingview.com/widgetembed/?frameElementId=tv-widget&symbol=${encodeURIComponent(symbol)}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=07111f&theme=dark&style=1&withdateranges=1&studies=[]&hideideas=1&widgetbar=details%7Cnews&locale=en#${config}`;
  }, [symbol]);

  return (
    <section className="card marketSurface">
      <div className="panelHeader" style={{ padding: '20px 20px 0 20px' }}>
        <div className="cardTitle">{title}</div>
        <div className="muted">Use this as the shared top chart. Swap symbol, add overlays, or replace with your licensed custom datafeed later.</div>
      </div>
      <iframe title={title} src={src} className="marketFrame" />
    </section>
  );
}
