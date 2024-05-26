import { SafeHtml } from "@angular/platform-browser";
import { CommunityDto } from "./CommunityDto";

export interface searchHighlightedCommunity {
    community:CommunityDto;
    searchHighlightedCommunity:string;
    searchHighlightedCommunityDescription:SafeHtml;
}