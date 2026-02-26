import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <div className="flex flex-col items-start justify-start pb-[600px] sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-center justify-center pt-8 pb-8 bg-neutral-900 overflow-hidden sm:w-full md:w-[1440px]">
            <img className="sm:w-full md:w-[1440px]" src="" alt="Image" />
            <Button className="bg-[#0e53ff] sm:w-full md:w-[1440px]" variant="default">Button</Button>
            <div className="flex flex-col items-start justify-center pr-9 pl-9 h-full max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
                <div className="flex flex-col items-start justify-between w-full">
                    <div className="flex flex-col md:flex-row items-start justify-start gap-4 w-full h-full md:flex-row">
                        <div className="flex flex-col items-start justify-start gap-[225px] p-6 max-w-[1368px] bg-[#1628f3] rounded-lg overflow-hidden xl:max-w-[1368px]">
                            <div className="flex flex-col items-start justify-start gap-6 w-full h-fit">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-72 w-full h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-fit">
                                        <p className="w-fit h-fit text-sm font-light text-white">ПРО ІНСТИТУТ</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start pt-1.5 pb-0.5 h-fit" />
                                </div>
                                <div className="flex flex-col items-start justify-start w-full h-fit">
                                    <p className="w-full h-fit text-[32px] font-medium text-white">Розвиток та 
Інновації в ІТ та Бізнесі</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full h-full">
                                <p className="w-full text-xs font-normal text-white">Бізнес й аналітика, Комп’ютерні науки, 
Фінанси та банківська справа, Маркетинг,
Менеджмент, Прикладна математика</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-[220px] px-5 py-6 max-w-[1368px] bg-[#1628f3] rounded-lg overflow-hidden xl:max-w-[1368px] sm:w-full md:w-[938px]">
                            <div className="flex flex-col items-start justify-start gap-6 w-full h-fit">
                                <div className="flex flex-col md:flex-row items-center justify-start gap-[814px] w-full h-fit md:flex-row">
                                    <div className="flex flex-col items-start justify-start w-fit h-fit">
                                        <p className="w-fit h-fit text-sm font-light text-white">ДАВАЙ ТРИМАТИ КОНТАКТ</p>
                                    </div>
                                    <div className="flex flex-col items-start justify-start pt-1.5 pb-0.5 w-fit h-fit" />
                                </div>
                                <div className="flex flex-col items-start justify-start w-full h-fit">
                                    <p className="w-full h-fit text-[32px] font-medium text-white">Нумо змінювати світ 
разом з нами!</p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-end justify-start gap-[172px] w-full h-fit md:flex-row">
                                <div className="flex flex-col items-start justify-end w-fit h-fit">
                                    <div className="flex flex-col items-start justify-end w-fit h-fit">
                                        <p className="w-fit h-fit text-7xl font-normal text-white">Start Studying</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start pt-[29px] pb-[18px] w-fit h-fit min-w-[180px]">
                                    <Button className="flex flex-col items-start justify-start gap-[3px] h-fit" variant="default">Контактуй з нами</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-8 w-full bg-white">
            <Separator className="bg-neutral-900 sm:w-full md:w-[1440px]" />
            <div className="flex flex-col items-start justify-start gap-2.5 pr-9 pl-9 w-fit h-fit max-w-[1440px] xl:max-w-[1440px]">
                <div className="flex flex-col md:flex-row items-start justify-between gap-[801px] md:flex-row sm:w-full md:w-[1368px]">
                    <div className="flex flex-col md:flex-row items-center justify-start gap-[50px] w-fit md:flex-row">
                        <p className="h-fit text-xs font-normal text-black">35800, м. Острог
вул. Семінарська, 2
www.oa.edu.ua
press@oa.edu.ua
+38 067 879 2526</p>
                        <img className="border border-black rounded-lg" src="" alt="Map" />
                    </div>
                    <div className="flex flex-col md:flex-row items-start justify-start gap-6 pt-[19px] pb-[19px] w-fit h-fit md:flex-row">
                        <div className="flex flex-col items-center justify-center p-[22px] rounded-[64px]" />
                        <div className="flex flex-col items-center justify-center p-[22px] rounded-[64px]" />
                        <div className="flex flex-col items-center justify-center p-[22px] rounded-[64px]" />
                        <div className="flex flex-col items-center justify-center p-[22px] rounded-[64px]" />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-3.5">
                        <div className="flex items-center justify-between pr-0 w-full h-fit max-w-[310px] overflow-hidden md:flex-row">
                            <div className="flex flex-col items-start justify-start w-full h-fit overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start justify-start w-full h-fit md:flex-row">
                                    <div className="overflow-hidden">
                                        <p className="shadow-2xl text-xs font-normal text-[#0e53ff]">ГОЛОВНА</p>
                                    </div>
                                    <div className="overflow-hidden">
                                        <Button className="bg-[#0e53ff]" variant="default">Button</Button>
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pr-0 w-full h-fit max-w-[310px] overflow-hidden md:flex-row">
                            <div className="flex flex-col items-start justify-start w-full h-fit overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start justify-start w-full h-fit md:flex-row">
                                    <div className="overflow-hidden">
                                        <p className="shadow-2xl text-[8px] font-normal uppercase text-black">Про інститут</p>
                                    </div>
                                    <div className="overflow-hidden">
                                        <Button className="bg-[#0e53ff]" variant="default">Button</Button>
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pr-0 w-full h-fit max-w-[310px] overflow-hidden md:flex-row">
                            <div className="flex flex-col items-start justify-start w-full h-fit overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start justify-start w-full h-fit md:flex-row">
                                    <div className="overflow-hidden">
                                        <p className="shadow-2xl text-[8px] font-normal uppercase text-black">Освітні програми</p>
                                    </div>
                                    <div className="overflow-hidden">
                                        <Button className="bg-[#0e53ff]" variant="default">Button</Button>
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pr-0 w-full h-fit max-w-[310px] overflow-hidden md:flex-row">
                            <div className="flex flex-col items-start justify-start w-full h-fit overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start justify-start w-full h-fit md:flex-row">
                                    <div className="overflow-hidden">
                                        <p className="shadow-2xl text-[8px] font-normal uppercase text-black">Новини та події</p>
                                    </div>
                                    <div className="overflow-hidden">
                                        <Button className="bg-[#0e53ff]" variant="default">Button</Button>
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                    <Button className="bg-black rounded-sm" variant="default">Button</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-start justify-start pl-9 w-full overflow-hidden">
            <div className="flex items-center justify-start gap-[860px] w-full h-full md:flex-row">
                <div className="flex flex-col md:flex-row items-center justify-start gap-8 w-fit h-fit md:flex-row">
                    <div className="flex flex-col items-start justify-start w-fit h-fit">
                        <p className="w-fit h-fit text-xs font-normal text-white">Cookie Preference</p>
                    </div>
                    <div className="flex flex-col items-start justify-start w-fit h-fit">
                        <p className="w-fit h-fit text-sm font-light text-white">Національний університет “Острозька академія”</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
