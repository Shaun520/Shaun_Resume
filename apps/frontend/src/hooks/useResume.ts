import { useReducer, useCallback, useEffect } from 'react'
import { resumeService } from '../services/resumeService'
import type { ResumeContent, BasicInfo, Education, WorkExperience, ProjectExperience, Skill } from '../types/resume'

interface ResumeState {
  resumeId: string | null
  title: string
  templateId: string
  schemaKey: string
  content: ResumeContent
  loading: boolean
  saving: boolean
  dirty: boolean
}

type ResumeAction =
  | { type: 'SET_RESUME'; payload: { id: string; title: string; templateId: string; schemaKey: string; content: ResumeContent } }
  | { type: 'SET_TEMPLATE_ID'; payload: { templateId: string; schemaKey: string } }
  | { type: 'SET_TEMPLATE_PERSISTED'; payload: { templateId: string; schemaKey: string } }
  | { type: 'UPDATE_META'; payload: { title?: string; templateId?: string } }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfo> }
  | { type: 'UPDATE_EDUCATION'; payload: Education[] }
  | { type: 'UPDATE_WORK'; payload: WorkExperience[] }
  | { type: 'UPDATE_PROJECTS'; payload: ProjectExperience[] }
  | { type: 'UPDATE_SKILLS'; payload: Skill[] }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }

const initialContent: ResumeContent = {
  basicInfo: { name: '', phone: '', email: '', address: '', summary: '', avatarUrl: '' },
  education: [],
  workExperience: [],
  projectExperience: [],
  skills: [],
}

const initialState: ResumeState = {
  resumeId: null,
  title: '',
  templateId: '',
  schemaKey: 'classic',
  content: initialContent,
  loading: true,
  saving: false,
  dirty: false,
}

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_RESUME':
      return {
        ...state,
        resumeId: action.payload.id,
        title: action.payload.title,
        templateId: action.payload.templateId,
        schemaKey: action.payload.schemaKey,
        content: action.payload.content ?? initialContent,
        loading: false,
        dirty: false,
      }
    case 'SET_TEMPLATE_ID':
      return { ...state, templateId: action.payload.templateId, schemaKey: action.payload.schemaKey, dirty: true }
    case 'SET_TEMPLATE_PERSISTED':
      return { ...state, templateId: action.payload.templateId, schemaKey: action.payload.schemaKey, dirty: false }
    case 'UPDATE_META':
      return {
        ...state,
        ...(action.payload.title !== undefined && { title: action.payload.title }),
        ...(action.payload.templateId !== undefined && { templateId: action.payload.templateId }),
      }
    case 'UPDATE_BASIC_INFO':
      return { ...state, content: { ...state.content, basicInfo: { ...state.content.basicInfo, ...action.payload } }, dirty: true }
    case 'UPDATE_EDUCATION':
      return { ...state, content: { ...state.content, education: action.payload }, dirty: true }
    case 'UPDATE_WORK':
      return { ...state, content: { ...state.content, workExperience: action.payload }, dirty: true }
    case 'UPDATE_PROJECTS':
      return { ...state, content: { ...state.content, projectExperience: action.payload }, dirty: true }
    case 'UPDATE_SKILLS':
      return { ...state, content: { ...state.content, skills: action.payload }, dirty: true }
    case 'SET_SAVING':
      return { ...state, saving: action.payload }
    case 'SET_DIRTY':
      return { ...state, dirty: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

/** 简历编辑状态管理 Hook：useReducer 管理本地简历数据快照 */
export function useResume(resumeId?: string) {
  const [state, dispatch] = useReducer(resumeReducer, initialState)

  // 加载简历数据
  const loadResume = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const data = await resumeService.getDetail(id)
      dispatch({
        type: 'SET_RESUME',
        payload: {
          id: data.id,
          title: data.title,
          templateId: data.templateId,
          schemaKey: data.schemaKey ?? 'classic',
          content: data.content ?? initialContent,
        },
      })
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // 初始化加载
  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId)
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [resumeId, loadResume])

  // 更新各字段
  const updateBasicInfo = useCallback((data: Partial<BasicInfo>) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: data })
  }, [])

  const updateEducation = useCallback((data: Education[]) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: data })
  }, [])

  const updateWorkExperience = useCallback((data: WorkExperience[]) => {
    dispatch({ type: 'UPDATE_WORK', payload: data })
  }, [])

  const updateProjectExperience = useCallback((data: ProjectExperience[]) => {
    dispatch({ type: 'UPDATE_PROJECTS', payload: data })
  }, [])

  const updateSkills = useCallback((data: Skill[]) => {
    dispatch({ type: 'UPDATE_SKILLS', payload: data })
  }, [])

  // 保存内容到服务端
  const saveContent = useCallback(async () => {
    if (!state.resumeId || !state.dirty) return

    dispatch({ type: 'SET_SAVING', payload: true })
    try {
      await resumeService.saveContent(state.resumeId, state.content)
      dispatch({ type: 'SET_DIRTY', payload: false })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false })
    }
  }, [state.resumeId, state.content, state.dirty])

  // 更新元信息（标题、模板）
  const updateMeta = useCallback(async (title?: string, templateId?: string) => {
    if (!state.resumeId) return
    const res = await resumeService.updateMeta(state.resumeId, { title, templateId })
    dispatch({ type: 'UPDATE_META', payload: { title: res.title, templateId: res.templateId } })
  }, [state.resumeId])

  // 切换模板（同步持久化到后端，状态标为已保存，不进入 dirty）
  const switchTemplate = useCallback(async (newTemplateId: string, newSchemaKey: string) => {
    if (!state.resumeId) {
      dispatch({ type: 'SET_TEMPLATE_PERSISTED', payload: { templateId: newTemplateId, schemaKey: newSchemaKey } })
      return
    }
    dispatch({ type: 'SET_SAVING', payload: true })
    try {
      await resumeService.updateMeta(state.resumeId, { templateId: newTemplateId })
      dispatch({ type: 'SET_TEMPLATE_PERSISTED', payload: { templateId: newTemplateId, schemaKey: newSchemaKey } })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false })
    }
  }, [state.resumeId])

  // 切换模板（仅本地，不调用后端）
  const setTemplateId = useCallback((newTemplateId: string, newSchemaKey: string) => {
    dispatch({ type: 'SET_TEMPLATE_ID', payload: { templateId: newTemplateId, schemaKey: newSchemaKey } })
  }, [])

  return {
    ...state,
    setTemplateId,
    switchTemplate,
    updateBasicInfo,
    updateEducation,
    updateWorkExperience,
    updateProjectExperience,
    updateSkills,
    saveContent,
    updateMeta,
    loadResume,
  }
}
