<?php

namespace App\Controller\Api;

use DateHelper;
use App\Entity\Task;
use App\Entity\User;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Repository\TaskRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Tasks')]
#[Route("")]
class TasksController extends AbstractController {
    public function __construct(
        private TaskRepository $taskRepository,
        private ProjectRepository $projectRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository
    ) {
    }

    #[Route('/projects/{id}/tasks/create', name: 'tasks_create_form', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects/{id}/tasks', name: 'tasks_create', methods: ["POST"])]
    public function create(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        // $app = $this->appRepository->findOneById($data->appId);
        $project = $this->projectRepository->findOneById($id);

        $task = new Task();
        $task->setName($data->name);
        $task->setStartDate(DateHelper::convertToDate($data->startDate));
        $task->setEndDate(DateHelper::convertToDate($data->endDate));
        $task->setCategory("task");
        $project->addTask($task);
        $this->projectRepository->save($project);

        return new JsonResponse($task->getData());
    }

    #[Route('/projects/{id}/tasks', name: 'tasks_overview', methods: ["GET"])]
    public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $tasks = $app->getProjects();
        $tasksData = EntityCollectionUtil::createCollectionData($tasks);

        return new JsonResponse($tasksData);
    }

    #[Route('/projects/{id}/tasks/{taskId}', name: 'tasks', methods: ["GET"])]
    public function getData(int $taskId): JsonResponse {
        $task = $this->taskRepository->findOneById($taskId);
        return new JsonResponse($task->getData());
    }

    #[Route('/projects/{id}/tasks/{taskId}', name: 'tasks_delete', methods: ["DELETE"])]
    public function delete(string $taskId, Request $request): JsonResponse {
        $task = $this->taskRepository->findOneById($taskId);
        $taskData = $task->getData();

        $this->taskRepository->delete($task);
        return new JsonResponse($taskData);
    }

    private function addAndEditForm(?Task $task = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Task name", FormField::TEXT, ["value" => $task?->getName()]);
        $formBuilder->add("startDate", "Start date", FormField::DATE, ["value" => $task?->getStartDate()]);
        $formBuilder->add("endDate", "End date", FormField::DATE, ["value" => $task?->getEndDate()]);
        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
