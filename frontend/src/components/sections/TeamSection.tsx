import { useQuery } from "@tanstack/react-query";
import { teamApi } from "@/services/api";
import { fallbackTeam } from "@/services/dataService";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

const TeamSection = () => {
  const { t, i18n } = useTranslation();
  const { data: teamData = [], isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: teamApi.getAll
  });
  const team = teamData.length ? teamData : fallbackTeam;
  const isAm = i18n.language === "am";
  const looped = team.length ? [...team, ...team, ...team] : team;

  return (
    <section className="py-24 bg-surface dark:bg-background overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface dark:from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface dark:from-background to-transparent z-10 pointer-events-none" />
      
      <div className="text-center max-w-3xl mx-auto mb-16 px-margin-mobile">
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-primary mb-4">{t("team.title")}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t("team.subtitle")}</p>
      </div>

      {isLoading && team.length === 0 ? (
        <div className="mt-8 flex justify-center gap-12 overflow-hidden px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4 opacity-50 w-[280px]">
              <Skeleton className="h-40 w-40 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="marquee marquee-full">
          <div className="marquee-track flex gap-8">
            {looped.map((member, index) => (
              <div className="flex flex-col items-center group w-[280px] flex-shrink-0" key={`${member.id}-${index}`}>
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-surface-container-high dark:border-surface-dim shadow-md group-hover:scale-105 group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={member.image}
                    alt={isAm ? member.nameAm : member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                      event.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary mb-1 text-center">
                  {isAm ? member.nameAm : member.name}
                </h3>
                <p className="font-body-md text-secondary font-medium mb-1 text-center">
                  {isAm ? member.roleAm : member.role}
                </p>
                <p className="font-body-sm text-sm text-on-surface-variant text-center">
                  {t("team.org")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamSection;
