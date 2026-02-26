import React from 'react';

export interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-4 h-fit sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-center justify-center pr-8 pl-8 max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-[556px] md:flex-row sm:w-full md:w-[1368px]">
                <div className="flex flex-col items-start justify-start pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit h-fit bg-black border border-white rounded-[320px]">
                    <div className="flex flex-col items-start justify-start w-full h-fit">
                        <p className="w-fit h-fit text-sm font-normal uppercase text-white">МЕНЮ</p>
                    </div>
                </div>
                <div className="flex items-center justify-center pt-0 max-w-[1368px] md:flex-row xl:max-w-[1368px]" />
                <div className="flex items-center justify-start w-fit h-fit md:flex-row">
                    <div className="flex flex-col items-start justify-start pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit h-fit bg-black border border-white rounded-[320px]">
                        <div className="flex flex-col items-start justify-start w-full h-fit">
                            <p className="w-fit h-fit text-sm font-normal uppercase text-white">КОНТАКТИ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
