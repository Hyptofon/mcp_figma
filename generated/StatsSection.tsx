import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export interface StatsSectionProps {
  className?: string;
}

export function StatsSection({ className }: StatsSectionProps) {
  return (
    <div className="flex flex-col items-start justify-start pt-20 pb-0.5 bg-white sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start gap-[52px] pr-9 pl-9 h-full max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex flex-col items-start justify-start w-full">
                <div className="flex flex-col items-start justify-start sm:w-full md:w-[1335px]">
                    <div className="flex flex-col items-start justify-start gap-10 h-fit sm:w-full md:w-[1335px]">
                        <div className="flex items-start justify-start h-fit md:flex-row sm:w-full md:w-[1334px]">
                            <div className="flex items-start justify-start w-fit h-fit md:flex-row">
                                <p className="w-fit h-fit text-[120px] font-semibold uppercase text-black">Інноваційна освіта</p>
                            </div>
                        </div>
                        <Separator className="bg-gray-500 sm:w-full md:w-[1314px]" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start pt-4">
                    <div className="w-full">
                        <p className="text-xl font-normal text-black">Створюємо майбутнє разом: технології, бізнес та аналітика в єдиному просторі.</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-end gap-[133px] w-full h-fit md:flex-row">
                <div className="flex flex-col items-start justify-start gap-8 h-full max-w-[404px]">
                    <div className="flex items-start justify-start w-full h-fit md:flex-row">
                        <div className="flex items-start justify-start w-fit h-fit md:flex-row">
                            <p className="w-fit h-fit text-[160px] font-normal text-black">500+</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="text-xl font-normal text-black">Успішних випускників щороку, які стають лідерами у сфері IT, фінансів та управління.</p>
                    </div>
                    <div className="flex items-center justify-center gap-8 pt-2 w-full h-fit md:flex-row">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-fit h-fit md:flex-row" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-8 h-full max-w-[404px]">
                    <div className="flex items-start justify-start gap-0 w-full h-fit md:flex-row">
                        <div className="flex items-start justify-start w-fit h-fit md:flex-row">
                            <p className="w-fit h-fit text-[160px] font-normal text-black">#1</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-full h-fit">
                        <p className="h-fit text-xl font-normal text-black">Серед інноваційних навчальних програм у сфері цифрової економіки та підприємництва.
Співпраця з 30+ компаніями Реальні кейси, стажування та можливості для міжнародного навчання.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-start justify-center w-full h-fit overflow-hidden md:flex-row">
            <div className="flex flex-col items-center justify-end w-full h-fit">
                <Button className="bg-[#0e53ff] sm:w-full md:w-[1440px]" variant="default">Button</Button>
                <Button className="sm:w-full md:w-[1440px]" variant="default">Button</Button>
            </div>
        </div>
    </div>
  );
}
