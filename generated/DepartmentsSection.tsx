import React from 'react';
import { Button } from '@/components/ui/button';

export interface DepartmentsSectionProps {
  className?: string;
}

export function DepartmentsSection({ className }: DepartmentsSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-fit bg-neutral-900 sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start pr-9 pl-9 h-fit max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex flex-col items-start justify-start gap-[500px] w-full h-fit">
                <div className="w-full overflow-hidden">
                    <div className="flex items-center justify-center pt-[110px] md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex items-start justify-center w-full bg-neutral-900 overflow-hidden md:flex-row">
                            <div className="flex flex-col items-start justify-start pb-0.5 w-full h-fit">
                                <div className="flex items-start justify-center w-full h-fit overflow-hidden md:flex-row">
                                    <div className="w-full">
                                        <img className="sm:w-full md:w-[2110.8845260384314px]" src="" alt="97d3076a82d618fe74e7fdbb548b0ca6 1" />
                                        <Button className="sm:w-full md:w-[1368px]" variant="default">Button</Button>
                                        <img className="sm:w-full md:w-[1079px]" src="" alt="Gemini_Generated_Image_axgkoraxgkoraxgk 1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-[293px] pt-2 pb-2 h-fit bg-neutral-900 border border-gray-700 md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-center w-fit h-fit">
                            <p className="w-fit h-fit text-2xl font-medium text-white">Кафедра фінансів та бізнесу</p>
                        </div>
                        <div className="flex flex-col items-start justify-center w-fit h-fit">
                            <div className="flex flex-col md:flex-row items-start justify-start gap-6 w-full h-full md:flex-row">
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Бізнес</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Фінанси</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Облік та оподаткування</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Підприємництво та торгівля</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-[5px] pr-[11px] pb-[3px] pl-[11px] w-fit h-fit border border-white rounded-[320px] md:flex-row">
                            <div className="flex flex-col items-start justify-start w-fit h-fit">
                                <p className="w-fit h-fit text-xs font-normal text-center text-white">ПЕРЕГЛЯНУТИ ІНФОРМАЦІЮ</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-hidden">
                    <div className="flex items-center justify-center pt-[110px] md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex items-start justify-center w-full bg-neutral-900 overflow-hidden md:flex-row">
                            <div className="w-full">
                                <img className="opacity-22 sm:w-full md:w-[2590.426242358788px]" src="" alt="97d3076a82d618fe74e7fdbb548b0ca6 1" />
                                <img className="sm:w-full md:w-[1168px]" src="" alt="Gemini_Generated_Image_82s0dh82s0dh82s0 1" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-start gap-[293px] pt-2 pb-2 h-fit bg-neutral-900 border border-gray-700 md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-start w-fit h-fit">
                            <p className="w-fit h-fit text-2xl font-medium text-white">Кафедра менеджменту та маркетингу</p>
                        </div>
                        <div className="flex flex-col items-start justify-center w-fit h-fit">
                            <div className="flex flex-col md:flex-row items-start justify-start gap-6 w-full h-full md:flex-row">
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Datа-маркетинг</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">аНАЛІТИКА</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">HR-менеджмент</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Менеджмент продажів</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-1.5 pr-[11px] pb-1 pl-[11px] w-fit h-fit max-w-[1368px] border border-white rounded-[320px] md:flex-row xl:max-w-[1368px]">
                            <div className="flex flex-col items-start justify-start w-fit h-fit">
                                <p className="w-fit h-fit text-xs font-normal text-center uppercase text-white">ПЕРЕГЛЯНУТИ ІНФОРМАЦІЮ</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-hidden">
                    <div className="flex items-center justify-center pt-[110px] md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex items-start justify-center w-full bg-neutral-900 overflow-hidden md:flex-row">
                            <div className="w-full overflow-hidden">
                                <img className="opacity-32 sm:w-full md:w-[1379px]" src="" alt="97d3076a82d618fe74e7fdbb548b0ca6 1" />
                                <img className="sm:w-full md:w-[1559px]" src="" alt="krea-edit (1) 1" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-[293px] pt-2 pb-2 h-fit bg-neutral-900 border border-gray-700 md:flex-row sm:w-full md:w-[1368px]">
                        <div className="flex flex-col items-start justify-start w-fit h-fit">
                            <p className="h-fit text-2xl font-medium text-white">Кафедра інформаційних технологій та аналітики даних</p>
                        </div>
                        <div className="flex flex-col items-start justify-center w-fit h-fit">
                            <div className="flex flex-col md:flex-row items-start justify-start gap-6 w-full h-full md:flex-row">
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">рОБОТОТЕХНІКА</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">шТУЧНИЙ ІНТЕЛЕКТ</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">іт</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-start w-fit">
                                    <div className="flex flex-col items-start justify-start w-full h-fit">
                                        <p className="w-fit h-fit text-xs font-medium uppercase text-gray-500">Економічна кібернетика</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-1.5 pr-[11px] pb-1 pl-[11px] w-fit h-fit max-w-[1368px] border border-white rounded-[320px] md:flex-row xl:max-w-[1368px]">
                            <div className="flex flex-col items-start justify-start w-fit h-fit">
                                <p className="w-fit h-fit text-xs font-normal text-center text-white">ПЕРЕГЛЯНУТИ ІНФОРМАЦІЮ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
