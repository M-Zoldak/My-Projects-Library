<?php

namespace App\Entity;

use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\EntityRepository;
use Doctrine\ORM\Mapping\InheritanceType;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\DiscriminatorColumn;

#[InheritanceType('JOINED')]
#[DiscriminatorColumn(name: 'discr', type: 'string')]
#[DiscriminatorMap([
    'user' => User::class,
    'site' => Site::class,
    'app' => App::class,
    'customer' => Customer::class,
    'site_options' => SiteOptions::class,
    'app_role' => AppRole::class,
    'section_permissions' => SectionPermissions::class,
    'project' => Project::class,
    'project_role' => ProjectRole::class
])]
#[ORM\Entity(repositoryClass: EntityRepository::class)]
abstract class Entity {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: "datetime_immutable")]
    private ?\DateTimeImmutable $modifiedAt = null;

    #[ORM\Column(type: "datetime_immutable")]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(options: ["default" => true])]
    private ?bool $isActive = null;

    public function __construct() {
        $this->createdAt = new DateTimeImmutable();
        $this->modifiedAt = new DateTimeImmutable();
        $this->isActive = true;
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getModifiedAt(): ?\DateTimeImmutable {
        return $this->modifiedAt;
    }

    public function setModifiedAt(\DateTimeImmutable $modifiedAt): static {
        $this->modifiedAt = $modifiedAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isIsActive(): ?bool {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static {
        $this->isActive = $isActive;

        return $this;
    }

    abstract function getData(): array;
}
