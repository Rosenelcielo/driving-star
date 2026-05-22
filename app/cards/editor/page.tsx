import { CardEditorClient } from "./CardEditorClient";
import { DEFAULT_EDITOR_CARD_ID } from "../../lib/card-drafts";

export default async function CardEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const cardId = params.id ?? DEFAULT_EDITOR_CARD_ID;
  const isNew = params.mode === "new";

  return <CardEditorClient cardId={cardId} isNew={isNew} key={`${cardId}-${isNew ? "new" : "edit"}`} />;
}
