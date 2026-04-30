const bannerSrc="https://s3.rdbuz.com/Images/responsiveweb/HomeBanner.webp";

const BusStopIcon=() => (
    <svg className="h-7 w-7 shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 18h11a3 3 0 0 0 3-3V8a4 4 0 0 0-4-4H7a3 3 0 0 0-3 3v8a3 3 0 0 0 2 2.83" />
        <path d="M4 11h16M8 4v14M16 18v2M6 20h4M14 20h4" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" />
        <path d="M2 8h2M2 12h2" />
    </svg>
);

const BusIcon=() => (
    <svg className="h-7 w-7 shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 18h12a3 3 0 0 0 3-3V8a4 4 0 0 0-4-4H5v14Z" />
        <path d="M5 10h15M9 4v14M17 18v2M5 20h4M15 20h4" />
        <circle cx="8" cy="15" r="1.5" fill="currentColor" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" />
        <path d="M20 8h2M20 12h2" />
    </svg>
);

const CalendarIcon=() => (
    <svg className="h-7 w-7 shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
);

const SearchIcon=() => (
    <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
);

const fields=[
    {label: "From", icon: <BusStopIcon />, className: "lg:rounded-l-[18px]"},
    {label: "To", icon: <BusIcon />, className: ""},
];

const formatToday=() => {
    const today=new Date();
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(today).replace(",", "");
};

const Home=() => (
    <main className="min-h-screen bg-white font-sans text-[#1d1d1d]">
        <section className="relative h-[390px] overflow-visible bg-[#ccd4e8] sm:h-[430px] lg:h-[470px]">
            <picture className="absolute inset-0 block h-full w-full">
                <source media="(max-width: 1023px)" srcSet={bannerSrc} />
                <source media="(max-width: 1279px)" srcSet={bannerSrc} />
                <source media="(min-width: 1280px)" srcSet={bannerSrc} />
                <img
                    src={bannerSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover object-center"
                />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

            <div className="relative mx-auto flex h-full max-w-[1700px] flex-col px-5 sm:px-8 lg:px-[8.5%]">
                <h1 className="max-w-[680px] pt-24 text-[2.3rem] font-extrabold leading-[1.18] tracking-normal text-white drop-shadow-sm sm:pt-28 sm:text-5xl lg:pt-32 lg:text-[3.3rem]">
                    India&apos;s No. 1 online
                    <br />
                    bus ticket booking site
                </h1>
            </div>

            <div className="absolute left-1/2 top-[292px] w-[min(82.8vw,1616px)] -translate-x-1/2 sm:top-[302px] lg:top-[310px]">
                <div className="rounded-[26px] bg-white px-5 pb-16 pt-5 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
                    <div className="grid overflow-hidden rounded-[18px] border border-[#cacaca] bg-white lg:h-[88px] lg:grid-cols-3">
                        {fields.map(({label, icon, className}) => (
                            <button
                                key={label}
                                type="button"
                                className={`relative flex min-h-20 items-center gap-5 border-b border-[#cacaca] px-7 text-left text-[1.55rem] font-medium text-[#6d6d6d] transition hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d64b4b] lg:min-h-0 lg:border-b-0 lg:border-r ${className}`}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}

                        <div className="flex min-h-20 items-center gap-5 px-7 lg:min-h-0">
                            <div className="flex min-w-0 items-center gap-4">
                                <CalendarIcon />
                                <div className="min-w-[178px]">
                                    <p className="text-base font-semibold leading-5 text-[#777]">Date of Journey</p>
                                    <p className="whitespace-nowrap text-[1.35rem] font-extrabold leading-7 text-[#1d1d1d]">
                                        {formatToday()} <span className="ml-1 text-sm font-semibold text-[#777]">(Today)</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="absolute left-1/2 bottom-[-28px] flex h-14 w-[340px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center justify-center gap-3 rounded-full bg-[#cf484a] text-xl font-extrabold text-white shadow-sm transition hover:bg-[#bd3f41] focus:outline-none focus:ring-4 focus:ring-[#cf484a]/25"
                    >
                        <SearchIcon />
                        Search buses
                    </button>
                </div>
            </div>
        </section>
    </main>
);


export default Home;
