import React from 'react';
import { Separator } from '@/components/ui/separator';

export interface LeadershipSectionProps {
  className?: string;
}

export function LeadershipSection({ className }: LeadershipSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-20 h-fit bg-white sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start gap-12 pr-9 pl-9 max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="w-full">
                <div className="flex flex-col items-start justify-start max-w-[160px]" />
                <div className="flex flex-col items-end justify-start sm:w-full md:w-[912px]">
                    <div className="flex items-start justify-end h-fit md:flex-row sm:w-full md:w-[877px]">
                        <p className="w-fit h-fit text-[80px] font-bold text-right text-black">Керівництво інституту</p>
                    </div>
                </div>
            </div>
            <Separator className="bg-neutral-900 sm:w-full md:w-[1368px]" />
            <div className="flex items-center justify-center md:flex-row sm:w-full md:w-[1368px]">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="flex flex-col md:flex-row items-center justify-center h-full md:flex-row sm:w-full md:w-[886px]">
                        <div className="flex flex-col items-start justify-between w-full h-full max-w-[840px]">
                            <div className="flex flex-col items-start justify-start w-full h-full">
                                <div className="flex flex-col items-center justify-start pl-[2004px] w-full h-fit overflow-hidden">
                                    <div className="flex flex-col items-start justify-start h-fit sm:w-full md:w-[2672px]">
                                        <div className="flex flex-col items-start justify-center sm:w-full md:w-[794px]">
                                            <div className="flex flex-col md:flex-row items-center justify-start gap-8 h-fit md:flex-row sm:w-full md:w-[794px]">
                                                <div className="flex flex-col items-start justify-center max-w-[258px] rounded-lg overflow-hidden">
                                                    <div className="h-full max-w-[211px] overflow-hidden">
                                                        <img className="" src="" alt="novoseletskyy_o 1" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start justify-start gap-2.5 pr-2 h-fit">
                                                    <div className="flex flex-col items-start justify-start gap-1">
                                                        <p className="w-fit h-fit text-base font-bold text-black">Новоселецький Олександр Миколайович</p>
                                                        <p className="w-full h-fit text-xs font-normal text-black">Директор Інституту ІТ та бізнесу, кандидат економічних наук, доцент кафедри інформаційних технологій та аналітики даних</p>
                                                    </div>
                                                    <div className="flex flex-col items-start justify-end">
                                                        <p className="w-full h-fit text-xs font-normal text-black">Контактна інформація:  e-mail: oleksandr.novoseletskyy@oa.edu.ua
 Офісні години: 
понеділок - п'ятниця: 8.30-17.30, обідня перерва: 12.30-13.30</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-2.5 pt-6 pb-6 w-fit h-fit">
                        <div className="h-fit" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
