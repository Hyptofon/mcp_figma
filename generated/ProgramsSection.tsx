import React from 'react';
import { Separator } from '@/components/ui/separator';

export interface ProgramsSectionProps {
  className?: string;
}

export function ProgramsSection({ className }: ProgramsSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-20 bg-white sm:w-full md:w-[1440px]">
        <div className="h-full max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex flex-col items-start justify-start h-fit sm:w-full md:w-[1368px]">
                <div className="w-full">
                    <div className="flex flex-col md:flex-row items-start justify-start h-fit md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-start pt-8 pr-16 pb-16">
                            <p className="w-fit h-fit text-[32px] font-extrabold text-black">Бакалаврат</p>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-16 pt-8 pr-16 pb-16">
                            <div className="flex flex-col items-start justify-start w-full h-fit">
                                <p className="w-full h-fit text-base font-normal text-black">Перелік спеціальностей
D2 «Фінанси, банківська справа, страхування та фондовий ринок» (ОПП «Фінанси та бізнес-аналітика»)
F3 «Комп'ютерні науки» (ОПП «Комп'ютерні науки»)
D3 «Менеджмент» (ОПП «Підприємництво та управління бізнесом»)
F3 «Комп'ютерні науки» (ОПП «Програмування роботизованих систем» (Робототехніка ))
D5 «Маркетинг» (ОПП «DATA-маркетинг та аналітика»)</p>
                            </div>
                        </div>
                        <img className="rounded-lg overflow-hidden" src="" alt="Photo" />
                    </div>
                    <Separator className="bg-neutral-900 sm:w-full md:w-[1368px]" />
                </div>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row items-start justify-start h-fit md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-start pt-8 pr-16 pb-16">
                            <p className="w-fit h-fit text-[32px] font-extrabold text-black">Магістратура</p>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-16 pt-8 pr-16 pb-16">
                            <div className="flex flex-col items-start justify-start w-full h-fit">
                                <p className="w-full h-fit text-base font-normal text-black">Перелік спеціальностей
D2 «Фінанси, банківська справа та страхування» (ОПП «Фінанси та бізнес-аналітика»)
D3 «Менеджмент» (ОПП «Менеджмент продажів та логістика»)
F3 «Комп'ютерні науки» (ОПП «Управління ІТ-проєктами»)
D3 «Менеджмент» (ОПП «HR-менеджмент»)
D1 «Облік і оподаткування» (ОПП «Облік і оподаткування»)</p>
                            </div>
                        </div>
                        <img className="rounded-lg overflow-hidden" src="" alt="Photo" />
                    </div>
                    <Separator className="bg-neutral-900 sm:w-full md:w-[1368px]" />
                </div>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row items-start justify-start h-fit md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-start pt-8 pr-16 pb-16">
                            <p className="w-fit h-fit text-[32px] font-extrabold text-black">Аспірантура</p>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-16 pt-8 pr-16 pb-16">
                            <div className="flex flex-col items-end justify-start w-full">
                                <p className="w-full h-fit text-base font-normal text-black">Перелік спеціальностей
D3 «Менеджмент» (ОНП «Менеджмент»)
F1 «Прикладна математика» (ОНП «Прикладна математика») </p>
                            </div>
                        </div>
                        <img className="rounded-lg overflow-hidden" src="" alt="Photo" />
                    </div>
                    <Separator className="bg-neutral-900 sm:w-full md:w-[1368px]" />
                </div>
                <Separator className="bg-neutral-900 sm:w-full md:w-[1368px]" />
            </div>
            <div className="flex flex-col items-start justify-center pl-[456px] h-fit sm:w-full md:w-[1368px]">
                <div className="flex flex-col items-end justify-start w-full">
                    <p className="w-fit h-fit text-[80px] font-bold text-right text-black">Спеціальності</p>
                </div>
            </div>
        </div>
    </div>
  );
}
