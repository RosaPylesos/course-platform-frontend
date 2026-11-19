import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import AdminUsersTab from "@/components/admin/AdminUsersTab"
import AdminCoursesTab from "@/components/admin/AdminCoursesTab"
import AdminLessonsTab from "@/components/admin/AdminLessonsTab"

import AdminTopicsTab from "@/components/admin/reference/AdminTopicsTab"
import AdminTagCategoriesTab from "@/components/admin/reference/AdminTagCategoriesTab"
import AdminTagsTab from "@/components/admin/reference/AdminTagsTab"

function AdminPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
            <h1 className="text-2xl font-bold">
                Панель администратора
            </h1>

            <Tabs defaultValue="users" className="w-full">
                <TabsList>
                    <TabsTrigger value="users">Пользователи</TabsTrigger>
                    <TabsTrigger value="courses">Курсы</TabsTrigger>
                    <TabsTrigger value="lessons">Уроки</TabsTrigger>
                    <TabsTrigger value="topics">Темы</TabsTrigger>
                    <TabsTrigger value="categories">Категории тегов</TabsTrigger>
                    <TabsTrigger value="tags">Теги</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <AdminUsersTab />
                </TabsContent>

                <TabsContent value="courses">
                    <AdminCoursesTab />
                </TabsContent>

                <TabsContent value="lessons">
                    <AdminLessonsTab />
                </TabsContent>

                <TabsContent value="topics">
                    <AdminTopicsTab />
                </TabsContent>

                <TabsContent value="categories">
                    <AdminTagCategoriesTab />
                </TabsContent>

                <TabsContent value="tags">
                    <AdminTagsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminPage