import React from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// services
import projectService from "services/project.service";
import estimatesService from "services/estimates.service";
// ui
import { CustomSelect } from "components/ui";
// icons
// fetch-keys
import { ESTIMATE_POINTS_LIST, PROJECT_DETAILS } from "constants/fetch-keys";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export const IssueEstimateSelect: React.FC<Props> = ({ value, onChange }) => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { data: projectDetails } = useSWR(
    workspaceSlug && projectId ? PROJECT_DETAILS(projectId as string) : null,
    workspaceSlug && projectId
      ? () => projectService.getProject(workspaceSlug as string, projectId as string)
      : null
  );

  const { data: estimatePoints } = useSWR(
    workspaceSlug && projectId && projectDetails && projectDetails.estimate
      ? ESTIMATE_POINTS_LIST(projectDetails.estimate)
      : null,
    workspaceSlug && projectId && projectDetails && projectDetails.estimate
      ? () =>
          estimatesService.getEstimatesPointsList(
            workspaceSlug as string,
            projectId as string,
            projectDetails.estimate
          )
      : null
  );

  return (
    <CustomSelect
      value={value}
      label={
        <div className="flex items-center  gap-2 text-xs w-[111px]">
          <span className={`${value ? "text-gray-600" : "text-gray-500"}`}>
            {estimatePoints?.find((e) => e.key === value)?.value ?? "Estimate points"}
          </span>
        </div>
      }
      onChange={onChange}
      position="right"
      width="w-full"
    >
      {estimatePoints &&
        estimatePoints.map((point) => (
          <CustomSelect.Option className="w-full" key={point.key} value={point.key}>
            {point.value}
          </CustomSelect.Option>
        ))}
    </CustomSelect>
  );
};