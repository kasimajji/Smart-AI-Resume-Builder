import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeResume } from '@/lib/api';

interface ATSAnalysisResult {
  score: number;
  feedback: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  }[];
  keywords: string[];
}

export function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ATSAnalysisResult | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(file);
        handleAnalyze(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF or DOCX file',
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async (fileToAnalyze: File) => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeResume(fileToAnalyze);
      setResults(analysis);
      
      if (analysis.score < 70) {
        toast({
          title: 'Low ATS Score',
          description: 'Your resume might need improvements to pass ATS systems',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze resume',
        variant: 'destructive',
      });
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityIcon = (type: 'success' | 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">ATS Compatibility Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
          }`}
        >
          <input {...getInputProps()} data-testid="file-input" />
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isDragActive
              ? 'Drop your resume here'
              : 'Drag and drop your resume here, or click to select'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Supported formats: PDF, DOCX
          </p>
        </div>

        {file && (
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span>{file.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAnalyze(file)}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isAnalyzing && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analyzing your resume...</p>
            <Progress value={45} className="w-full" />
          </div>
        )}

        {results && !isAnalyzing && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">ATS Compatibility Score</p>
              <div className="relative w-32 h-32 mx-auto">
                <div className={`absolute inset-0 rounded-full ${getSeverityColor(results.score)} opacity-10`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{results.score}%</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              <div className="space-y-3">
                {results.feedback.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {getSeverityIcon(item.type)}
                    <p className="text-sm">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {results.keywords.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Keywords Found</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}