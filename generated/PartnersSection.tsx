import React from 'react';

export interface PartnersSectionProps {
  className?: string;
}

export function PartnersSection({ className }: PartnersSectionProps) {
  return (
    <div className="flex flex-col items-start justify-start pt-20 pb-20 h-fit bg-white sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start w-full h-fit overflow-hidden">
            <div className="w-full overflow-hidden">
                <div className="flex flex-col items-start justify-start w-fit">
                    <div className="flex flex-col md:flex-row items-start justify-start pt-4 pb-4 w-full h-fit md:flex-row">
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                        <div className="flex flex-col items-start justify-center pr-8 pl-8 w-fit h-full" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-fit">
                    <div className="flex flex-col md:flex-row items-start justify-start pt-4 pb-4 w-full h-fit md:flex-row">
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                        <div className="h-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
