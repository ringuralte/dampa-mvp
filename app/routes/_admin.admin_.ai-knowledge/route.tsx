import type { ActionFunctionArgs } from 'react-router'
import { useEffect } from 'react'
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { getKnowledgeBase, updateKnowledgeBase } from '~/lib/knowledge-base'

export async function loader() {
  const currentKb = await getKnowledgeBase()
  return { currentKb }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const newKb = formData.get('knowledgeBase')

  if (typeof newKb !== 'string' || !newKb) {
    return { error: 'Content cannot be empty' }
  }

  await updateKnowledgeBase(newKb)
  return { success: true }
}

export default function AdminPage() {
  const { currentKb } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  const isSaving = navigation.state === 'submitting'

  useEffect(() => {
    if (navigation.state === 'idle') {
      if (actionData?.success) {
        toast.success('Changes saved successfully', { id: 'save-toast' })
      }
      else if (actionData?.error) {
        toast.error(actionData.error, { id: 'save-toast' })
      }
    }
  }, [isSaving, navigation.state, actionData])

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">AI Chatbot Knowledge Base </h1>

      <p className="mb-8 text-muted-foreground">
        Update the knowledge base for the chatbot below
      </p>

      <div className={`
        grid gap-8
        lg:grid-cols-2
      `}
      >
        {/* Read-only Rules Section */}
        {/* <div className="rounded-md border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Fixed System Rules</h2>
          <pre className="font-mono text-xs whitespace-pre-wrap text-gray-600">
            {FIXED_SYSTEM_INSTRUCTIONS}
          </pre>
        </div> */}

        {/* Editable Knowledge Base Section */}
        <div className="lg:col-span-2">
          <Form method="post" className="space-y-6">
            <div>
              <label
                htmlFor="knowledgeBase"
                className="mb-2 block text-sm font-medium"
              >
                Knowledge Base Content
              </label>
              <textarea
                name="knowledgeBase"
                id="knowledgeBase"
                defaultValue={currentKb}
                className={`
                  h-[60vh] w-full rounded-md border border-gray-300 p-4
                  font-mono text-sm shadow-sm
                  focus:border-orange-500 focus:ring-orange-500
                `}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
