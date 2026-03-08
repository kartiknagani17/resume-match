const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export interface JobListing {
  job_id: string;
  employer_name: string;
  job_title: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_country?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_employment_type?: string;
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: Record<string, unknown>;
  data: JobListing[];
}

export async function searchJobs(
  query: string,
  options?: { page?: number; numPages?: number }
): Promise<JobListing[]> {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not set. Get one from RapidAPI JSearch.");
  }

  const page = options?.page ?? 1;
  const numPages = options?.numPages ?? 1;
  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("num_pages", String(numPages));
   url.searchParams.set("country", "us");
   url.searchParams.set("date_posted", "all");

  console.log("[jobs] calling JSearch", {
    url: url.toString(),
    page,
    numPages,
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`JSearch API error: ${res.status} ${err}`);
  }

  const json = (await res.json()) as JSearchResponse;
  console.log("[jobs] JSearch response", {
    status: json.status,
    requestId: json.request_id,
    resultCount: json.data?.length ?? 0,
  });
  return json.data || [];
}
