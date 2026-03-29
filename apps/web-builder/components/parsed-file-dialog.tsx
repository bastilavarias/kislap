'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useParsedFiles } from '@/hooks/api/use-parsed-files';
import { APIResponseParsedFile } from '@/types/api-response';
import { AlertCircle, FileSearch, Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

type ParsedFileKind = 'image' | 'pdf';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectType: 'portfolio' | 'menu';
  sourceType: 'resume' | 'menu';
  title: string;
  description: string;
  maxFiles?: number;
  acceptedKinds?: ParsedFileKind[];
  onApplyParsedData: (data: Record<string, any>) => void;
}

export function ParsedFileDialog({
  open,
  onOpenChange,
  projectType,
  sourceType,
  title,
  description,
  maxFiles = 1,
  acceptedKinds = ['pdf'],
  onApplyParsedData,
}: Props) {
  const { list, create } = useParsedFiles();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [items, setItems] = useState<APIResponseParsedFile[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const accept = {
    ...(acceptedKinds.includes('pdf') ? { 'application/pdf': [] } : {}),
    ...(acceptedKinds.includes('image')
      ? { 'image/png': [], 'image/jpeg': [], 'image/jpg': [], 'image/webp': [] }
      : {}),
  };
  const supportText = acceptedKinds.includes('image')
    ? 'PNG, JPG, WEBP, or PDF. Max 10MB each.'
    : 'PDF only. Max 10MB each.';

  const loadHistory = async (targetPage = 1) => {
    setIsLoadingList(true);
    const response = await list({ projectType, page: targetPage, limit: 6 });
    if (response.success && response.data) {
      setItems(response.data.data || []);
      setLastPage(response.data.meta?.last_page || 1);
    }
    setIsLoadingList(false);
  };

  useEffect(() => {
    if (!open) return;
    setPage(1);
    setActiveTab('upload');
    setFiles([]);
    setError('');
    void loadHistory(1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void loadHistory(page);
  }, [page]);

  const handleParse = async () => {
    if (!files.length) return;
    setLoading(true);
    setError('');

    const response = await create({ projectType, sourceType, files });
    if (response.success && response.data) {
      if (response.data.parsed_data) {
        onApplyParsedData(response.data.parsed_data);
      }
      setFiles([]);
      onOpenChange(false);
    } else {
      setError(response.message || 'Unable to parse file');
    }

    setLoading(false);
  };

  const handleSelectParsed = (item: APIResponseParsedFile) => {
    if (!item.parsed_data) return;
    onApplyParsedData(item.parsed_data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'history')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Parse</TabsTrigger>
            <TabsTrigger value="history">Parsed History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Parsing Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Dropzone
              className={cn(
                'min-h-[220px] border-2 border-dashed border-muted-foreground/30 rounded-xl',
                'bg-muted/10 hover:bg-muted/20 transition-colors'
              )}
              accept={accept}
              maxFiles={maxFiles}
              maxSize={1024 * 1024 * 10}
              onDrop={setFiles}
              onError={(message) => setError(message)}
            >
              <DropzoneEmptyState>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="rounded-full border bg-background p-3">
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Drop your file here</p>
                    <p className="text-xs text-muted-foreground">{supportText}</p>
                  </div>
                </div>
              </DropzoneEmptyState>
              <DropzoneContent files={files} />
            </Dropzone>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleParse}
                disabled={loading || files.length === 0}
                className="shadow-none"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Parsing
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <FileSearch className="h-4 w-4" />
                    Parse Now
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Parsed At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingList ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                        Loading parsed history...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                        No parsed files yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.source_name}</TableCell>
                        <TableCell className="capitalize">{item.source_type}</TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-none"
                            onClick={() => handleSelectParsed(item)}
                          >
                            Use
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((prev) => Math.max(1, prev - 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-2 text-xs text-muted-foreground">
                    Page {page} of {lastPage}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((prev) => Math.min(lastPage, prev + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
