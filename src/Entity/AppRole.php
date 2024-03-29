<?php

namespace App\Entity;

use App\Enums\StandardSections;
use Doctrine\ORM\Mapping as ORM;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use Doctrine\Common\Collections\Collection;
use App\Repository\SectionPermissionsRepository;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: AppRoleRepository::class)]
class AppRole extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'roles', cascade: ["persist"])]
    private ?App $app = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'appRoles', cascade: ["persist", "remove"])]
    private Collection $users;

    #[ORM\Column(options: ["default" => true])]
    private ?bool $destroyable = true;

    #[ORM\OneToMany(mappedBy: 'appRole', targetEntity: SectionPermissions::class, cascade: ["remove", "persist"], orphanRemoval: true)]
    private Collection $sectionPermissions;

    #[ORM\Column]
    private ?bool $isOwnerRole = null;

    public function __construct(string $roleName, App $app, private SectionPermissionsRepository $sectionPermissionsRepository) {
        parent::__construct();

        $this->setName($roleName);
        $this->users = new ArrayCollection();
        $this->setApp($app);
        $this->sectionPermissions = new ArrayCollection();
        if ($roleName == "Owner") {
            $this->setIsOwnerRole(true);
            $app->setDefaultRole($this);
        } else {
            $this->setIsOwnerRole(false);
        }

        foreach (StandardSections::cases() as $section) {
            if ($roleName == "Owner") {
                $sectionPermissions = new SectionPermissions($this, $section->value, true, true, true);
            } else {
                $sectionPermissions = new SectionPermissions($this, $section->value);
            }

            $this->sectionPermissionsRepository->save($sectionPermissions);
            $this->addSectionPermission($sectionPermissions);
        }
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "ownerApp" => $this->getApp()->getData(),
            "name" => $this->getName(),
            "isOwnerRole" => $this->isOwnerRole(),
            "permissions" => EntityCollectionUtil::createNamedCollectionData($this->getSectionPermissions(), "sectionName")
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection {
        return $this->users;
    }

    public function addUser(User $user): static {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static {
        $this->users->removeElement($user);

        return $this;
    }

    public function isDestroyable(): ?bool {
        return $this->destroyable;
    }

    public function setIsDestroyable(bool $destroyable): static {
        $this->destroyable = $destroyable;

        return $this;
    }

    /**
     * @return Collection<int, SectionPermissions>
     */
    public function getSectionPermissions(): Collection {
        return $this->sectionPermissions;
    }

    public function addSectionPermission(SectionPermissions $sectionPermission): static {
        if (!$this->sectionPermissions->contains($sectionPermission)) {
            $this->sectionPermissions->add($sectionPermission);
            $sectionPermission->setAppRole($this);
        }

        return $this;
    }

    public function removeSectionPermission(SectionPermissions $sectionPermission): static {
        if ($this->sectionPermissions->removeElement($sectionPermission)) {
            // set the owning side to null (unless already changed)
            if ($sectionPermission->getAppRole() === $this) {
                $sectionPermission->setAppRole(null);
            }
        }

        return $this;
    }

    public function isOwnerRole(): ?bool {
        return $this->isOwnerRole;
    }

    public function setIsOwnerRole(bool $isOwnerRole): static {
        $this->isOwnerRole = $isOwnerRole;

        return $this;
    }
}
