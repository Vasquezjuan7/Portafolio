export interface ResumeDownloadMeta {
  fileName: string;
  format: 'pdf';
  fileSizeKb: number;
  lastGenerated: string;
}

export interface ResumeSectionBlock {
  heading: string;
  entries: string[];
}
