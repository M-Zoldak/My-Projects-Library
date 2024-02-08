<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240207122935 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA14A76ED395');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
        // $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA14A76ED395');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        // $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48DA76ED395');
    }
}
