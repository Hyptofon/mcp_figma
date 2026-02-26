import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export interface NewsSectionProps {
  className?: string;
}

export function NewsSection({ className }: NewsSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-20 h-fit bg-white sm:w-full md:w-[1440px]">
        <div className="flex flex-col items-start justify-start gap-12 pr-9 pl-9 max-w-[1440px] xl:max-w-[1440px] sm:w-full md:w-[1440px]">
            <div className="flex flex-col items-end justify-start w-full h-fit">
                <div className="flex flex-col items-start justify-start w-full">
                    <div className="w-full">
                        <div className="flex items-start justify-start w-fit h-fit md:flex-row">
                            <p className="w-fit h-fit text-[80px] font-bold text-black">Новини та події</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-start pt-10 w-full">
                    <Separator className="bg-gray-500 sm:w-full md:w-[1350px]" />
                </div>
                <div className="flex items-start justify-start gap-5 pb-20 w-full h-fit md:flex-row">
                    <div className="flex flex-col items-start justify-start gap-2.5 w-full h-fit">
                        <div className="flex flex-col items-end justify-start gap-5 w-full h-fit">
                            <Button className="flex flex-col items-start justify-start pt-3.5 pb-3.5" variant="default">Більше новин</Button>
                            <div className="flex flex-col md:flex-row items-center justify-start gap-5 w-fit h-fit md:flex-row">
                                <div className="">
                                    <div className="flex flex-col items-start justify-center pt-[22px]">
                                        <div className="flex flex-col items-start justify-start gap-6 w-full h-full">
                                            <div className="flex flex-col md:flex-row items-center justify-between w-full h-fit md:flex-row">
                                                <div className="flex flex-col items-center justify-center pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit border border-[#0e53ff] rounded-[100px]">
                                                    <div className="flex flex-col items-center justify-between w-full">
                                                        <p className="w-fit h-fit text-xs font-normal text-center text-[#0e53ff]">НОВИНА ТИЖНЯ</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center pl-[174px] w-full h-full min-w-[42px]">
                                                    <div className="flex flex-col items-end justify-center">
                                                        <div className="flex flex-col items-end justify-center">
                                                            <p className="w-fit h-fit text-sm font-light text-right text-black">Feb 19</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-[15px] w-full h-fit">
                                                <div className="w-full">
                                                    <p className="text-xl font-normal text-black">When an Award-Winning
Website Pays for Itself
(Twice)</p>
                                                </div>
                                                <div className="flex items-start justify-start w-full h-fit md:flex-row">
                                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                                        <p className="w-fit h-fit text-sm font-light text-gray-500"> MIN READ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center h-fit rounded-lg overflow-hidden" />
                                    <div className="flex flex-col items-start justify-start pt-10 h-fit">
                                        <Button className="flex flex-col items-start justify-start gap-[3px] h-fit" variant="default">Дізнатися більше</Button>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="flex flex-col items-start justify-center pt-[22px]">
                                        <div className="flex flex-col items-start justify-start gap-6 w-full h-full">
                                            <div className="flex flex-col md:flex-row items-center justify-between w-full h-fit md:flex-row">
                                                <div className="flex flex-col items-center justify-center pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit border border-[#0e53ff] rounded-[100px]">
                                                    <div className="flex flex-col items-center justify-between w-full">
                                                        <p className="w-fit h-fit text-xs font-normal text-center text-[#0e53ff]">НОВИНА ТИЖНЯ</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center pl-[174px] w-full h-full min-w-[42px]">
                                                    <div className="flex flex-col items-end justify-center">
                                                        <div className="flex flex-col items-end justify-center">
                                                            <p className="w-fit h-fit text-sm font-light text-right text-black">Feb 19</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-[15px] w-full h-fit">
                                                <div className="w-full">
                                                    <p className="text-xl font-normal text-black">When an Award-Winning
Website Pays for Itself
(Twice)</p>
                                                </div>
                                                <div className="flex items-start justify-start w-full h-fit md:flex-row">
                                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                                        <p className="w-fit h-fit text-sm font-light text-gray-500"> MIN READ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center h-fit rounded-lg overflow-hidden" />
                                    <div className="flex flex-col items-start justify-start pt-10 h-fit">
                                        <Button className="flex flex-col items-start justify-start gap-[3px] h-fit" variant="default">Дізнатися більше</Button>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="flex flex-col items-start justify-center pt-[22px]">
                                        <div className="flex flex-col items-start justify-start gap-6 w-full h-full">
                                            <div className="flex flex-col md:flex-row items-center justify-between w-full h-fit md:flex-row">
                                                <div className="flex flex-col items-center justify-center pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit border border-[#0e53ff] rounded-[100px]">
                                                    <div className="flex flex-col items-center justify-between w-full">
                                                        <p className="w-fit h-fit text-xs font-normal text-center text-[#0e53ff]">НОВИНА ТИЖНЯ</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center pl-[174px] w-full h-full min-w-[42px]">
                                                    <div className="flex flex-col items-end justify-center">
                                                        <div className="flex flex-col items-end justify-center">
                                                            <p className="w-fit h-fit text-sm font-light text-right text-black">Feb 19</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-[15px] w-full h-fit">
                                                <div className="w-full">
                                                    <p className="text-xl font-normal text-black">When an Award-Winning
Website Pays for Itself
(Twice)</p>
                                                </div>
                                                <div className="flex items-start justify-start w-full h-fit md:flex-row">
                                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                                        <p className="w-fit h-fit text-sm font-light text-gray-500"> MIN READ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center h-fit rounded-lg overflow-hidden" />
                                    <div className="flex flex-col items-start justify-start pt-10 h-fit">
                                        <Button className="flex flex-col items-start justify-start gap-[3px] h-fit" variant="default">Дізнатися більше</Button>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="flex flex-col items-start justify-center pt-[22px]">
                                        <div className="flex flex-col items-start justify-start gap-6 w-full h-full">
                                            <div className="flex flex-col md:flex-row items-center justify-between w-full h-fit md:flex-row">
                                                <div className="flex flex-col items-center justify-center pt-2.5 pr-[18px] pb-2 pl-[18px] w-fit border border-[#0e53ff] rounded-[100px]">
                                                    <div className="flex flex-col items-center justify-between w-full">
                                                        <p className="w-fit h-fit text-xs font-normal text-center text-[#0e53ff]">НОВИНА ТИЖНЯ</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center pl-[174px] w-full h-full min-w-[42px]">
                                                    <div className="flex flex-col items-end justify-center">
                                                        <div className="flex flex-col items-end justify-center">
                                                            <p className="w-fit h-fit text-sm font-light text-right text-black">Feb 19</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-[15px] w-full h-fit">
                                                <div className="w-full">
                                                    <p className="text-xl font-normal text-black">When an Award-Winning
Website Pays for Itself
(Twice)</p>
                                                </div>
                                                <div className="flex items-start justify-start w-full h-fit md:flex-row">
                                                    <div className="flex flex-col items-start justify-start w-fit h-full">
                                                        <p className="w-fit h-fit text-sm font-light text-gray-500"> MIN READ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center h-fit rounded-lg overflow-hidden" />
                                    <div className="flex flex-col items-start justify-start pt-10 h-fit">
                                        <Button className="flex flex-col items-start justify-start gap-[3px] h-fit" variant="default">Дізнатися більше</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
