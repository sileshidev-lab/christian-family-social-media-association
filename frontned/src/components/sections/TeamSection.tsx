import { useQuery } from "@tanstack/react-query";
import { teamApi } from "@/services/api";
import { fallbackTeam } from "@/services/dataService";
import { useTranslation } from "react-i18next";

const TeamSection = () => {
  const { t, i18n } = useTranslation();
  const { data: teamData = [], isLoading, isError } = useQuery({
    queryKey: ["team"],
    queryFn: teamApi.getAll
  });
  const team = teamData.length ? teamData : fallbackTeam;
  const isAm = i18n.language === "am";
  const looped = team.length ? [...team, ...team, ...team] : team;

  return (
    <section className="section-padding pt-10 pb-6">
      <div className="container space-y-3 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="section-title text-3xl md:text-4xl">{t("team.title")}</h2>
          <p className="text-muted-foreground">{t("team.subtitle")}</p>
        </div>
      </div>
      {isLoading && team.length === 0 ? (
        <div className="mt-6 text-sm text-muted-foreground">Loading leadership...</div>
      ) : (
        <div className="marquee marquee-full">
          <div className="marquee-track">
            {looped.map((member, index) => (
              <div className="marquee-item" key={`${member.id}-${index}`}>
                <div className="marquee-avatar">
                  <img
                    src={member.image}
                    alt={isAm ? member.nameAm : member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                      event.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <p className="text-sm font-semibold text-center">
                  {isAm ? member.nameAm : member.name}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  {isAm ? member.roleAm : member.role}
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
