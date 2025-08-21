import type { InferLiveObject } from "@live-state/sync";
import type { schema } from "api/schema";
import { atomWithCookie } from "~/utils/cookie-atoms";

export const activeOrganizationAtom = atomWithCookie<
  InferLiveObject<(typeof schema)["organization"]> | undefined
>("activeOrganization", undefined);
