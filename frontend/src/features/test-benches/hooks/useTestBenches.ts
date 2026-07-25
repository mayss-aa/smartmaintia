import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  testBenchesService,
  type CreateTestBenchPayload,
} from '@/features/test-benches/services/test-benches.service'

export function useTestBenches() {
  return useQuery({
    queryKey: ['test-benches'],
    queryFn: () => testBenchesService.getAll(),
  })
}

export function useCreateTestBench() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: CreateTestBenchPayload) => testBenchesService.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['test-benches'] }),
  })
}

export function useUpdateTestBench() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: Partial<CreateTestBenchPayload> }) =>
      testBenchesService.update(code, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['test-benches'] }),
  })
}

export function useDeleteTestBench() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => testBenchesService.delete(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['test-benches'] }),
  })
}
