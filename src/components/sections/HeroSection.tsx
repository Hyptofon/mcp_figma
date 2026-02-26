import React from 'react';
import { Separator } from '@/components/ui/separator';

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start gap-12 pr-9 pl-9 h-full max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex items-center justify-start pt-[325px] w-full h-fit md:flex-row">
                <div className="flex flex-col items-start justify-start w-full h-fit">
                    <div className="flex flex-col items-start justify-start pb-8 w-full h-fit">
                        <div className="w-full">
                            <p className="sm:w-full md:w-[1368px] text-8xl font-bold text-white">Обирай навчання, яке відповідає викликам майбутнього!</p>
                        </div>
                    </div>
                    <Separator className="bg-gray-500 sm:w-full md:w-[1368px]" />
                    <div className="flex flex-col items-start justify-start pt-8 w-full h-fit">
                        <div className="flex items-end justify-start gap-9 w-full h-fit md:flex-row">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-2.5 h-fit md:flex-row">
                                <div className="flex flex-col md:flex-row items-start justify-start gap-[11px] w-fit h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-base font-normal uppercase text-white">•</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-white">ІТ</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-normal uppercase text-white">/</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start justify-start gap-[11px] w-fit h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-base font-normal uppercase text-white">•</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-white">БІЗНЕС</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-normal uppercase text-white">/</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start justify-start gap-[11px] w-fit h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-base font-normal uppercase text-white">•</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-white">МЕНЕДЖМЕНТ</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-normal uppercase text-white">/</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start justify-start gap-[11px] w-fit h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-base font-normal uppercase text-white">•</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-white">Фінанси</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-normal uppercase text-white">/</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start justify-start gap-[11px] w-fit h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-base font-normal uppercase text-white">•</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-white">Маркетинг</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                        <p className="w-fit h-fit text-xs font-normal uppercase text-white">/</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between gap-16 w-full h-fit md:flex-row">
                <div className="flex flex-col items-start justify-start gap-10 pt-[39px] pb-72 w-fit min-w-[824px]">
                    <div className="flex flex-col items-start justify-start w-full h-fit">
                        <p className="w-full h-fit text-[32px] font-normal text-white">Інститут інформаційних технологій та бізнесу — простір, де народжуються лідери цифрової ери. Ми поєднуємо технології, бізнес та інновації, щоб готувати фахівців, які не просто адаптуються до змін, а й створюють їх.

Наші студенти отримують актуальні знання та практичний досвід у IT, аналітиці, управлінні й підприємництві. Співпраця з провідними компаніями дає їм конкурентні переваги у світі технологій та бізнесу.</p>
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden">
                    <img className="" src="" alt="4f64c688bd941de218f6647a1cc0ad04 1" />
                    <img className="" src="" alt="4f64c688bd941de218f6647a1cc0ad04 2" />
                </div>
            </div>
        </div>
    </div>
  );
}
